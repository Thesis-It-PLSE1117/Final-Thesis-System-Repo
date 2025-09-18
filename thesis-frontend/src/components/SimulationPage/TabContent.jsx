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
  handleDataCenterChange 
}) => {
  const handleViewResults = async (result) => {
    console.log('onViewResults called with:', result);
    
    try {
      const pairedResults = await historyService.getPairedHistoryResults(result.id);
      console.log('pairedResults:', pairedResults);
      
      if (pairedResults && (pairedResults.eaco || pairedResults.epso)) {
        console.log('pairedResults.eaco:', pairedResults.eaco);
        console.log('pairedResults.epso:', pairedResults.epso);
        
        // Add safety checks for eaco and epso existence
        const convertedResults = {
          eaco: pairedResults.eaco ? {
            ...pairedResults.eaco,
            plotData: pairedResults.eaco.plotAnalysis ? {
              algorithm: pairedResults.eaco.plotAnalysis.algorithm,
              simulationId: pairedResults.eaco.plotAnalysis.simulationId,
              metrics: pairedResults.eaco.plotAnalysis.metrics,
              plotMetadata: pairedResults.eaco.plotAnalysis.plotMetadata,
              plotPaths: [] 
            } : null,
            plotMetadata: pairedResults.eaco.plotAnalysis?.plotMetadata || [],
            analysis: pairedResults.eaco.plotAnalysis?.analysis
          } : null,
          epso: pairedResults.epso ? {
            ...pairedResults.epso,
            plotData: pairedResults.epso.plotAnalysis ? {
              algorithm: pairedResults.epso.plotAnalysis.algorithm,
              simulationId: pairedResults.epso.plotAnalysis.simulationId,
              metrics: pairedResults.epso.plotAnalysis.metrics,
              plotMetadata: pairedResults.epso.plotAnalysis.plotMetadata,
              plotPaths: [] 
            } : null,
            plotMetadata: pairedResults.epso.plotAnalysis?.plotMetadata || [],
            analysis: pairedResults.epso.plotAnalysis?.analysis
          } : null
        };
        
        console.log('convertedResults:', convertedResults);
        
        setSimulationResults(convertedResults);
        setSimulationState('results');
      } else {
        console.log('No paired results found, trying single result');
        
        // Fall back to using the single result
        const singleResult = {
          eaco: result.algorithm === 'EACO' ? {
            ...result,
            plotData: null,
            plotMetadata: [],
            analysis: result.analysis
          } : null,
          epso: result.algorithm === 'EPSO' ? {
            ...result,
            plotData: null,
            plotMetadata: [],
            analysis: result.analysis
          } : null
        };
        
        console.log('singleResult:', singleResult);
        
        setSimulationResults(singleResult);
        setSimulationState('results');
        showNotification('Viewing single algorithm result', 'info');
      }
    } catch (error) {
      console.error('Error loading results:', error);
      showNotification('Error loading results: ' + error.message, 'error');
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
            // In the TabContent component or wherever DataCenterTab is rendered:
            <DataCenterTab
              config={config.dataCenterConfig}
              onChange={handleDataCenterChange}
              presetConfigs={config.presetConfigs}
              selectedPreset={config.selectedPreset}
              clearPreset={config.clearPreset}  // This should be passed directly
              applyPreset={config.applyPresetConfig} // This should be passed directly
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
              onMatlabToggle={(value) => config.setEnableMatlabPlots(value)}
              iterations={config.iterationConfig.iterations}
              cloudletToggleEnabled={config.cloudletToggleEnabled}
              onCloudletToggleChange={config.handleCloudletToggleChange}
              defaultCloudletCount={config.DEFAULT_CLOUDLET_COUNT}
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