import { lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as historyService from '../../services/historyService';
import { showNotification } from '../common/ErrorNotification';

// Lazy load tabs
const DataCenterTab = lazy(() => import('../DatacenterTab/DataCenterTab'));
const WorkloadTab = lazy(() => import('../WorkloadTab/WorkloadTab'));
const IterationTab = lazy(() => import('../IterationTab/IterationTab'));
const HelpTab = lazy(() => import('../HelpTab/HelpTab'));
const HistoryTab = lazy(() => import('../HistoryTab/HistoryTab'));

// Animation variants
const tabContentVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  },
  exit: (direction) => ({
    x: direction < 0 ? 50 : -50,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  })
};

export const TabContent = ({ 
  activeTab, 
  direction, 
  config, 
  setSimulationResults, 
  setSimulationState, 
  setActiveTab, 
  handleDataCenterChange,
  fileInputRef,
  clearWorkloadFile,
  clearPreset
}) => {
  const handleViewResults = async (result) => {
    try {
      if (!result || !result.id) {
        throw new Error('Invalid result object: missing required data');
      }

      console.log('Result object:', {
        id: result.id,
        baseId: result.baseId,
        algorithm: result.algorithm,
        hasRawResults: !!result.rawResults,
        hasSummary: !!result.summary
      });

      const pairedResults = await historyService.getPairedHistoryResults(result.id);
      
      if (!pairedResults || (!pairedResults.eaco && !pairedResults.epso)) {
        throw new Error('Failed to load paired results from history');
      }

      const reconstructResult = (algorithmResult) => {
        if (!algorithmResult) return null;

        const rawResults = algorithmResult.rawResults || {};
        const summary = algorithmResult.summary || rawResults.summary || {};
        
        const schedulingLog = algorithmResult.schedulingLog || 
                              rawResults.schedulingLog || 
                              (rawResults.individualResults && rawResults.individualResults[0]?.schedulingLog) ||
                              (rawResults.bestResult?.schedulingLog) ||
                              [];
        
        const energyConsumption = algorithmResult.energyConsumption || 
                                  rawResults.energyConsumption || 
                                  (rawResults.individualResults && rawResults.individualResults[0]?.energyConsumption) ||
                                  [];
        
        const vmUtilization = algorithmResult.vmUtilization || 
                             rawResults.vmUtilization || 
                             (rawResults.individualResults && rawResults.individualResults[0]?.vmUtilization) ||
                             [];
        
        return {
          ...algorithmResult,
          summary,
          schedulingLog,
          energyConsumption,
          vmUtilization,
          rawResults: {
            summary,
            averageMetrics: rawResults.averageMetrics || summary.averageMetrics || summary,
            stdDevMetrics: rawResults.stdDevMetrics || {},
            minMetrics: rawResults.minMetrics || {},
            maxMetrics: rawResults.maxMetrics || {},
            totalIterations: rawResults.totalIterations || rawResults.individualResults?.length || 1,
            individualResults: rawResults.individualResults || [],
            bestResult: rawResults.bestResult || null,
            energyConsumption,
            vmUtilization,
            schedulingLog
          },
          plotData: algorithmResult.plotAnalysis ? {
            algorithm: algorithmResult.plotAnalysis.algorithm || algorithmResult.algorithm,
            simulationId: algorithmResult.plotAnalysis.simulationId || algorithmResult.simulationId,
            metrics: algorithmResult.plotAnalysis.metrics || summary,
            plotMetadata: algorithmResult.plotAnalysis.plotMetadata || [],
            plotPaths: [],
            hasPlots: algorithmResult.plotAnalysis.hasPlots || false
          } : null,
          plotMetadata: algorithmResult.plotAnalysis?.plotMetadata || [],
          analysis: algorithmResult.plotAnalysis?.analysis || null,
          tTestResults: algorithmResult.tTestResults || null,
          runId: algorithmResult.runId || null,
          seed: algorithmResult.seed || null,
          configSnapshot: algorithmResult.configSnapshot || algorithmResult.config || null,
          datasetId: algorithmResult.datasetId || null
        };
      };

      const convertedResults = {
        eaco: reconstructResult(pairedResults.eaco),
        epso: reconstructResult(pairedResults.epso)
      };

      if (!convertedResults.eaco && !convertedResults.epso) {
        throw new Error('Failed to reconstruct results from history data');
      }

      setSimulationResults(convertedResults);
      setSimulationState('results');
      showNotification('Results loaded successfully', 'success');
      
    } catch (error) {
      console.error('Error loading results:', error);
      showNotification(`Failed to load results: ${error.message}`, 'error');
    }
  };

  return (
    <AnimatePresence custom={direction} mode="wait">
      <motion.div
        key={activeTab}
        custom={direction}
        variants={tabContentVariants}
        initial="enter"
        animate="center"
        exit="exit"
        className="w-full"
      >
        <Suspense fallback={<div>Loading...</div>}>
          {activeTab === 'dataCenter' && (
            <DataCenterTab
              config={config.dataCenterConfig}
              onChange={handleDataCenterChange}
              presetConfigs={config.presetConfigs}
              selectedPreset={config.selectedPreset}
              clearPreset={clearPreset}
              applyPreset={config.applyPresetConfig}
            />
          )}
          {activeTab === 'workload' && (
            <WorkloadTab
              config={config.cloudletConfig}
              onChange={config.handleCloudletChange}
              onFileUpload={config.handleFileUpload}
              workloadFile={config.workloadFile}
              csvRowCount={config.csvRowCount}
              onPresetSelect={config.handlePresetSelect}
              selectedPreset={config.selectedPreset}
              enableMatlabPlots={config.enableMatlabPlots}
              onMatlabToggle={config.setEnableMatlabPlots}
              iterations={config.iterationConfig.iterations}
              cloudletToggleEnabled={config.cloudletToggleEnabled}
              onCloudletToggleChange={config.handleCloudletToggleChange}
              defaultCloudletCount={config.DEFAULT_CLOUDLET_COUNT}
              fileInputRef={fileInputRef}
              clearWorkloadFile={clearWorkloadFile}
            />
          )}
          {activeTab === 'iterations' && (
            <IterationTab
              config={config.iterationConfig}
              onChange={(newConfig) => {
                config.setIterationConfig(newConfig);
              }}
            />
          )}
          {activeTab === 'history' && (
            <HistoryTab 
              onBack={() => setActiveTab('dataCenter')}
              onViewResults={handleViewResults}
            />
          )}
          {activeTab === 'help' && <HelpTab />}
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};