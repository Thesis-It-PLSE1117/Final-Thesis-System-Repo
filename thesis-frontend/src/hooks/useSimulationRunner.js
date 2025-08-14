import { useState } from 'react';
import { showNotification } from '../components/common/ErrorNotification';
import { validateSimulationConfig } from '../utils/validation';
import { normalizeTTestResults } from '../utils/ttestNormalizer';
import * as apiClient from '../services/apiClient';
import * as historyService from '../services/historyService';

/**
 * custom hook for running simulations
 * i use this since you know for the sake of keeping all the complex simulation logic in one place
 */
export const useSimulationRunner = () => {
  const [simulationResults, setSimulationResults] = useState(null);
  const [progress, setProgress] = useState(0);
  const [simulationState, setSimulationState] = useState('config');
  const [plotTrackingIds, setPlotTrackingIds] = useState(null);
  const [plotStatus, setPlotStatus] = useState(null); // 'pending', 'generating', 'completed', 'failed'

  // run a single algorithm with async plot support
  const runAlgorithm = async (algorithm, configData, withPlots, workloadFile, useAsync = false, retryCount = 0) => {
    try {
      // i check iterations as a valid for using the right endpoint
      const useIterations = configData.iterations > 1;
      
      console.log('DEBUG runAlgorithm:', { algorithm, withPlots, workloadFile: !!workloadFile, useIterations, iterations: configData.iterations });
      if (withPlots && !workloadFile && !useIterations) {
        console.log('SHOULD USE PLOTS API!');
        // use async plot generation for better ux
        if (useAsync) {
          return await apiClient.runWithPlotsAsync(algorithm, configData);
        }
        // fallback to sync if needed
        try {
          return await apiClient.runWithPlots(algorithm, configData);
        } catch (error) {
          if (error.message === 'MATLAB_WARMING_UP' && retryCount < 3) {
            // i wait here since you know for the sake of letting matlab warm up
            // but limit retries to prevent infinite recursion
            await new Promise(resolve => setTimeout(resolve, 5000));
            return runAlgorithm(algorithm, configData, withPlots, workloadFile, useAsync, retryCount + 1);
          }
          throw error;
        }
      } else if (workloadFile) {
        if (useIterations) {
          return await apiClient.runIterationsWithFile(algorithm, configData, workloadFile);
        } else {
          // Pass enableMatlabPlots flag with the config
          const configWithPlots = { ...configData, enableMatlabPlots: withPlots };
          return await apiClient.runWithFile(algorithm, configWithPlots, workloadFile);
        }
      } else {
        if (useIterations) {
          return await apiClient.runIterations(algorithm, configData);
        } else {
          return await apiClient.run(algorithm, configData);
        }
      }
    } catch (error) {
      throw error;
    }
  };
  
  // poll for plot status
  const pollPlotStatus = async (trackingIds) => {
    if (!trackingIds) return null;
    
    const checkStatus = async () => {
      try {
        const statuses = await Promise.all(
          Object.entries(trackingIds).map(async ([algo, id]) => {
            const status = await apiClient.getPlotStatus(id);
            return { algo, ...status };
          })
        );
        
        // check if all plots are completed
        const allCompleted = statuses.every(s => s.status === 'COMPLETED');
        const anyFailed = statuses.some(s => s.status === 'FAILED');
        
        if (allCompleted) {
          setPlotStatus('completed');
          // fetch the actual plot data
          const plotData = {};
          for (const [algo, id] of Object.entries(trackingIds)) {
            const results = await apiClient.getPlotResults(id);
            if (results.ready && results.plotData) {
              plotData[algo.toLowerCase()] = results.plotData;
            }
          }
          return { completed: true, data: plotData };
        } else if (anyFailed) {
          setPlotStatus('failed');
          return { failed: true };
        } else {
          setPlotStatus('generating');
          return { pending: true };
        }
      } catch (error) {
        console.error('Error polling plot status:', error);
        return { failed: true };
      }
    };
    
    // poll every 2 seconds until complete, with max attempts
    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = 60; // max 2 minutes of polling
      
      const interval = setInterval(async () => {
        attempts++;
        const result = await checkStatus();
        
        if (result.completed) {
          clearInterval(interval);
          resolve(result.data);
        } else if (result.failed || attempts >= maxAttempts) {
          clearInterval(interval);
          resolve(null);
        }
        // continue polling if pending
      }, 2000);
    });
  };

  // validate and run simulation
  const runSimulation = async (config) => {
    const {
      dataCenterConfig,
      cloudletConfig,
      iterationConfig,
      enableMatlabPlots,
      workloadFile
    } = config;

    // validate configuration
    const errors = validateSimulationConfig({
      ...dataCenterConfig,
      ...cloudletConfig,
      ...iterationConfig
    });
    
    if (Object.keys(errors).length > 0) {
      showNotification(`Please fix configuration errors: ${Object.values(errors).join(', ')}`, 'error');
      return false;
    }

    setSimulationState('loading');
    setProgress(0);
    
    const configData = {
      numHosts: dataCenterConfig.numHosts,
      numVMs: dataCenterConfig.numVMs,
      numPesPerHost: dataCenterConfig.numPesPerHost,
      peMips: dataCenterConfig.peMips,
      ramPerHost: dataCenterConfig.ramPerHost,
      bwPerHost: dataCenterConfig.bwPerHost,
      storagePerHost: dataCenterConfig.storagePerHost,
      vmMips: dataCenterConfig.vmMips,
      vmPes: dataCenterConfig.vmPes,
      vmRam: dataCenterConfig.vmRam,
      vmBw: dataCenterConfig.vmBw,
      vmSize: dataCenterConfig.vmSize,
      numCloudlets: cloudletConfig.numCloudlets,
      vmScheduler: dataCenterConfig.vmScheduler,
      workloadType: workloadFile ? 'CSV' : 'Random',
      useDefaultWorkload: !workloadFile,
      iterations: iterationConfig.iterations || 1
    };
    
    try {
      // i adjust speed since you know for the sake of showing realistic progress
      const progressMultiplier = iterationConfig.iterations > 1 ? 0.6 : 1.0;
      
      let progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev < 10) return prev + (2 * progressMultiplier);
          if (prev < 30) return prev + (1.5 * progressMultiplier);
          if (prev < 60) return prev + (0.8 * progressMultiplier);
          if (prev < 90) return prev + (0.5 * progressMultiplier);
          if (prev >= 95) return prev;
          return prev + (0.3 * progressMultiplier);
        });
      }, 500);
      
      try {
        // i use comparison for 30+ iterations since you know for the sake of statistical significance
        const useComparison = iterationConfig.iterations >= 30;
        
        if (useComparison) {
          console.log('Using comparison');
          
          let comparisonResults;
          if (workloadFile) {
            comparisonResults = await apiClient.compareWithFile(configData, workloadFile);
          } else {
            comparisonResults = await apiClient.compare(configData);
          }
          console.log('Comparison results received:', comparisonResults);
          
          // i normalize t-test results since you know for the sake of handling different backend formats
          const tTestResultsNormalized = normalizeTTestResults(
            comparisonResults.tTestResults || comparisonResults.ttestResults || null
          );
          if (!tTestResultsNormalized) {
            console.warn('No tTestResults found in comparison response');
          }
          
          /**
           * I include analysis field for comparison mode 
           * The interpretation is in tTestResults.interpretation, not separate analysis fields
           */
          const combinedResults = {
            eaco: {
              rawResults: comparisonResults.eacoResults,
              summary: comparisonResults.eacoResults?.averageMetrics,
              tTestResults: tTestResultsNormalized,
              iterationsAdjusted: comparisonResults.iterationsAdjusted,
              originalIterations: comparisonResults.originalIterations,
              adjustmentMessage: comparisonResults.adjustmentMessage,
              iterations: comparisonResults.iterations,
              // For comparison, we don't have separate analysis per algorithm
              analysis: null
            },
            epso: {
              rawResults: comparisonResults.epsoResults,
              summary: comparisonResults.epsoResults?.averageMetrics,
              tTestResults: tTestResultsNormalized,
              iterationsAdjusted: comparisonResults.iterationsAdjusted,
              originalIterations: comparisonResults.originalIterations,
              adjustmentMessage: comparisonResults.adjustmentMessage,
              iterations: comparisonResults.iterations,
              // For comparison, we don't have separate analysis per algorithm
              analysis: null
            }
          };
          
          setSimulationResults(combinedResults);
          historyService.saveToHistory(combinedResults, dataCenterConfig, cloudletConfig, workloadFile);
        } else {
          // use async plot generation when matlab plots are enabled
          const useAsyncPlots = enableMatlabPlots && !workloadFile && iterationConfig.iterations === 1;
          
          if (useAsyncPlots) {
            // run both algorithms with async plot generation
            setPlotStatus('pending');
            
            const eacoResponse = await runAlgorithm("EACO", configData, enableMatlabPlots, workloadFile, true);
            const epsoResponse = await runAlgorithm("EPSO", configData, enableMatlabPlots, workloadFile, true);
            
            // extract tracking ids if async was used
            const trackingIds = {};
            if (eacoResponse.plotTrackingId) {
              trackingIds.eaco = eacoResponse.plotTrackingId;
            }
            if (epsoResponse.plotTrackingId) {
              trackingIds.epso = epsoResponse.plotTrackingId;
            }
            
            /**
             * I include analysis from backend response for async mode too
             */
            const combinedResults = {
              eaco: {
                rawResults: eacoResponse.simulationResults || eacoResponse,
                summary: eacoResponse.simulationResults?.summary || eacoResponse.summary,
                analysis: eacoResponse.analysis // Include backend analysis
              },
              epso: {
                rawResults: epsoResponse.simulationResults || epsoResponse,
                summary: epsoResponse.simulationResults?.summary || epsoResponse.summary,
                analysis: epsoResponse.analysis // Include backend analysis
              },
              plotsGenerating: true
            };
            
            setSimulationResults(combinedResults);
            setPlotTrackingIds(trackingIds);
            setProgress(70);
            
            // start polling for plot completion in background
            pollPlotStatus(trackingIds).then(plotData => {
              if (plotData) {
                // merge plot data into results
                setSimulationResults(prev => ({
                  ...prev,
                  eaco: { ...prev.eaco, plotData: plotData.eaco },
                  epso: { ...prev.epso, plotData: plotData.epso },
                  plotsGenerating: false
                }));
              }
            });
            
            historyService.saveToHistory(combinedResults, dataCenterConfig, cloudletConfig, workloadFile);
          } else {
            // use synchronous plot generation
            const eacoResponse = await runAlgorithm("EACO", configData, enableMatlabPlots, workloadFile, false);
            setProgress(70);
            const epsoResponse = await runAlgorithm("EPSO", configData, enableMatlabPlots, workloadFile, false);
            
            /**
             * I extract analysis field from backend response to get interpretations
             * The backend sends simulationResults AND analysis but we were missing it
             */
            const combinedResults = {
              eaco: {
                rawResults: eacoResponse.simulationResults || eacoResponse.rawResults || eacoResponse,
                summary: eacoResponse.simulationResults?.summary || eacoResponse.summary || eacoResponse.rawResults?.summary,
                plotData: eacoResponse.plotData,
                analysis: eacoResponse.analysis // ADD THIS - Backend interpretations!
              },
              epso: {
                rawResults: epsoResponse.simulationResults || epsoResponse.rawResults || epsoResponse,
                summary: epsoResponse.simulationResults?.summary || epsoResponse.summary || epsoResponse.rawResults?.summary,
                plotData: epsoResponse.plotData,
                analysis: epsoResponse.analysis // ADD THIS - Backend interpretations!
              }
            };
            setSimulationResults(combinedResults);
            historyService.saveToHistory(combinedResults, dataCenterConfig, cloudletConfig, workloadFile);
          }
        }
        
        clearInterval(progressInterval);
        setProgress(100);
        
        setTimeout(() => {
          setSimulationState('animation');
        }, 500);
        
        return true;
      } catch (algorithmError) {
        clearInterval(progressInterval);
        // Check if the error is due to cancellation
        if (algorithmError.name === 'CancelledError' || algorithmError.message === 'Request cancelled') {
          showNotification('Simulation cancelled', 'info');
        } else {
          showNotification(`Failed to run algorithms: ${algorithmError.message}`, 'error');
        }
        setSimulationState('config');
        return false;
      }
    } catch (err) {
      // Check if the error is due to cancellation
      if (err.name === 'CancelledError' || err.message === 'Request cancelled') {
        showNotification('Simulation cancelled', 'info');
      } else {
        showNotification(`Failed to run simulation: ${err.message}`, 'error');
      }
      setSimulationState('config');
      return false;
    }
  };

  // cancel the simulation
  const cancelSimulation = () => {
    // Simple cancel - just reset states
    setProgress(0);
    setSimulationState('config');
    showNotification('Simulation cancelled by user', 'info');
  };

  return {
    simulationResults,
    setSimulationResults,
    progress,
    setProgress,
    simulationState,
    setSimulationState,
    runSimulation,
    cancelSimulation,
    plotStatus,
    plotTrackingIds
  };
};
