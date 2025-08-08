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

  // run a single algorithm
  const runAlgorithm = async (algorithm, configData, withPlots, workloadFile) => {
    try {
      // i check iterations as a valid for using the right endpoint
      const useIterations = configData.iterations > 1;
      
      if (withPlots && !workloadFile && !useIterations) {
        try {
          return await apiClient.runWithPlots(algorithm, configData);
        } catch (error) {
          if (error.message === 'MATLAB_WARMING_UP') {
            // i wait here since you know for the sake of letting matlab warm up
            await new Promise(resolve => setTimeout(resolve, 5000));
            return runAlgorithm(algorithm, configData, withPlots, workloadFile);
          }
          throw error;
        }
      } else if (workloadFile) {
        if (useIterations) {
          return await apiClient.runIterationsWithFile(algorithm, configData, workloadFile);
        } else {
          return await apiClient.runWithFile(algorithm, configData, workloadFile);
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
          
          const combinedResults = {
            eaco: {
              rawResults: comparisonResults.eacoResults,
              summary: comparisonResults.eacoResults?.averageMetrics,
              tTestResults: tTestResultsNormalized
            },
            epso: {
              rawResults: comparisonResults.epsoResults,
              summary: comparisonResults.epsoResults?.averageMetrics,
              tTestResults: tTestResultsNormalized
            }
          };
          
          setSimulationResults(combinedResults);
          historyService.saveToHistory(combinedResults, dataCenterConfig, cloudletConfig, workloadFile);
        } else {
          const eacoResponse = await runAlgorithm("EACO", configData, enableMatlabPlots, workloadFile);
          setProgress(70);
          const epsoResponse = await runAlgorithm("EPSO", configData, enableMatlabPlots, workloadFile);
          
          const combinedResults = {
            eaco: eacoResponse,
            epso: epsoResponse
          };
          setSimulationResults(combinedResults);
          historyService.saveToHistory(combinedResults, dataCenterConfig, cloudletConfig, workloadFile);
        }
        
        clearInterval(progressInterval);
        setProgress(100);
        
        setTimeout(() => {
          setSimulationState('animation');
        }, 500);
        
        return true;
      } catch (algorithmError) {
        clearInterval(progressInterval);
        showNotification(`Failed to run algorithms: ${algorithmError.message}`, 'error');
        setSimulationState('config');
        return false;
      }
    } catch (err) {
      showNotification(`Failed to run simulation: ${err.message}`, 'error');
      setSimulationState('config');
      return false;
    }
  };

  return {
    simulationResults,
    setSimulationResults,
    progress,
    setProgress,
    simulationState,
    setSimulationState,
    runSimulation
  };
};
