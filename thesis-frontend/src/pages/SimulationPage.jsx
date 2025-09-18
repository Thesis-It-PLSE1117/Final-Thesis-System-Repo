import { useState, useEffect, lazy, Suspense, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { showNotification } from '../components/common/ErrorNotification';
import { useAutoSave } from '../hooks/useAutoSave';
import ConfirmationDialog from '../components/common/ConfirmationDialog';

// components
import Header from '../components/SimulationPage/Header';
import TabNav from '../components/SimulationPage/TabNav';
import { TabContent } from '../components/SimulationPage/TabContent';
import { RunSimulationButton } from '../components/SimulationPage/RunSimulationButton';
import { UndoRedoButtons } from '../components/SimulationPage/UndoRedoButtons';

// custom hooks
import { useSimulationConfig } from '../hooks/useSimulationConfig';
import { useUndoRedoConfig } from '../hooks/useUndoRedoConfig';
import { useSimulationRunner } from '../hooks/useSimulationRunner';

// lazy load tabs
const AnimationTab = lazy(() => import('../components/AnimationTab/AnimationTab'));
const ResultsTab = lazy(() => import('../components/ResultsTab/ResultsTab'));

import CloudLoadingModal from '../components/modals/CloudLoadingModal';

// Animation variants
const pageVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

const SimulationPage = ({ onBack }) => {
  const config = useSimulationConfig();
  const {
    simulationResults,
    setSimulationResults,
    progress,
    setProgress,
    simulationState,
    setSimulationState,
    runSimulation,
    cancelSimulation,
    isAborting,
    canAbort
  } = useSimulationRunner();
  
  // ui states
  const [activeTab, setActiveTab] = useState('dataCenter');
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const [userCancelledSession, setUserCancelledSession] = useState(false);
  const [direction, setDirection] = useState(0);
  const fileInputRef = useRef(null);
  
  // Fixed tab order - workload comes before iterations
  const tabOrder = ['dataCenter', 'iterations', 'workload', 'history', 'help'];

  // undo/redo functionality
  const { canUndo, canRedo, handleUndo, handleRedo } = useUndoRedoConfig(
    config.getAllConfig(),
    config.restoreConfig
  );
  
  // confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });
  
  // progress tracking
  const [workflowStep, setWorkflowStep] = useState(0);
  
  // computed values
  const effectiveCloudletCount = config.getEffectiveCloudletCount();
  const completedConfigs = [
    Object.keys(config.dataCenterConfig).length > 0,
    effectiveCloudletCount > 0 || config.workloadFile !== null,
    config.iterationConfig.iterations > 0
  ].filter(Boolean).length;

  const configProgress = Math.round((completedConfigs / 3) * 100);
  
  // auto-save configuration
  const saveableConfig = config.getAllConfig();
  const { isSaving, lastSaved } = useAutoSave(saveableConfig, simulationState === 'config');

  useEffect(() => {
    const savedConfig = localStorage.getItem('simulationConfig');
    if (savedConfig) {
      setConfirmDialog({
        isOpen: true,
        title: 'Restore Previous Configuration?',
        message: 'We found a saved configuration from your last session. Would you like to restore it?',
        onConfirm: () => {
          const parsedConfig = JSON.parse(savedConfig);
          config.restoreConfig(parsedConfig);
          showNotification('Previous configuration restored', 'success');
          setConfirmDialog({ isOpen: false });
        },
      });
    }
  }, []);
  
  useEffect(() => {
    if (simulationState === 'config') {
      switch (activeTab) {
        case 'dataCenter': setWorkflowStep(0); break;
        case 'iterations': setWorkflowStep(1); break;
        case 'workload': setWorkflowStep(2); break;
        default: setWorkflowStep(0);
      }
    } else if (simulationState === 'loading') {
      setWorkflowStep(3);
    } else if (simulationState === 'animation') {
      setWorkflowStep(4);
    } else if (simulationState === 'results') {
      setWorkflowStep(5);
    }
  }, [activeTab, simulationState]);

  // Handle data center changes including preset application
  const handleDataCenterChange = useCallback((e) => {
    const { name, value } = e.target;
    
    if (name === 'applyPreset') {
      // This is a preset selection
      config.applyPresetConfig(value);
      return;
    }
    
    // Handle regular data center changes
    config.handleDataCenterChange(e);
  }, [config]);
  
  const executeSimulation = useCallback(async () => {
    if (isCoolingDown) return;
    
    try {
      const totalOperations = config.dataCenterConfig.numVMs * effectiveCloudletCount * config.iterationConfig.iterations;
      if (totalOperations > 100000) {
        setConfirmDialog({
          isOpen: true,
          title: 'Large Simulation Warning',
          message: `This simulation will process ${totalOperations.toLocaleString()} operations. This may take several minutes. Do you want to continue?`,
          onConfirm: async () => {
            setConfirmDialog({ isOpen: false });
            setIsCoolingDown(true);
            setUserCancelledSession(false); 
            await runSimulation({
              dataCenterConfig: config.dataCenterConfig,
              cloudletConfig: config.cloudletConfig,
              iterationConfig: config.iterationConfig,
              enableMatlabPlots: config.enableMatlabPlots,
              workloadFile: config.workloadFile
            });
            setTimeout(() => setIsCoolingDown(false), 1000);
          }
        });
        return;
      }
      
      setIsCoolingDown(true);
      setUserCancelledSession(false);
      await runSimulation({
        dataCenterConfig: config.dataCenterConfig,
        cloudletConfig: config.cloudletConfig,
        iterationConfig: config.iterationConfig,
        enableMatlabPlots: config.enableMatlabPlots,
        workloadFile: config.workloadFile
      });
      setTimeout(() => setIsCoolingDown(false), 1000);
    } catch (error) {
      setIsCoolingDown(false);
      showNotification(`Failed to start simulation: ${error.message}`, 'error');
    }
  }, [config, isCoolingDown, runSimulation, effectiveCloudletCount]);
  
  const handleTabChange = (newTab) => {
    const currentIndex = tabOrder.indexOf(activeTab);
    const newIndex = tabOrder.indexOf(newTab);
    setDirection(newIndex > currentIndex ? 1 : -1);
    setActiveTab(newTab);
  };

  const renderConfigContent = () => (
    <>
      <TabNav activeTab={activeTab} onChange={handleTabChange} />

      <main className="flex-grow p-6 overflow-y-auto">
        <TabContent 
          activeTab={activeTab} 
          direction={direction} 
          config={config}
          setSimulationResults={setSimulationResults}
          setSimulationState={setSimulationState}
          setActiveTab={setActiveTab}
          handleDataCenterChange={handleDataCenterChange}
        />

        {activeTab === 'workload' && (
          <RunSimulationButton
            effectiveCloudletCount={effectiveCloudletCount}
            isSimulating={simulationState === 'loading'}
            simulationState={simulationState}
            isCoolingDown={isCoolingDown}
            config={config}
            executeSimulation={executeSimulation}
          />
        )}
      </main>
      
      <UndoRedoButtons 
        simulationState={simulationState}
        canUndo={canUndo}
        canRedo={canRedo}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
      />
    </>
  );
  
  const renderContent = () => {
    switch (simulationState) {
      case 'config':
        return renderConfigContent();
        
      case 'loading':
        return (
          <>
            {renderConfigContent()}
            <CloudLoadingModal 
              numCloudlets={effectiveCloudletCount}
              numHosts={config.dataCenterConfig.numHosts}
              numVMs={config.dataCenterConfig.numVMs}
              progress={progress}
              iterations={config.iterationConfig.iterations}
              onAbort={() => {
                setUserCancelledSession(true);
                cancelSimulation();
              }}
              canAbort={canAbort}
              isAborting={isAborting}
            />
          </>
        );

      case 'animation':
        return (
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#319694]"></div>
            </div>
          }>
            <AnimationTab
              dataCenterConfig={config.dataCenterConfig}
              cloudletConfig={config.cloudletConfig}
              workloadFile={config.workloadFile}
              eacoResults={simulationResults?.eaco}
              epsoResults={simulationResults?.epso}
              onBack={() => setSimulationState('config')}
              onViewResults={() => setSimulationState('results')}
            />
          </Suspense>
        );

      case 'results':
        return (
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#319694]"></div>
            </div>
          }>
            <ResultsTab 
              results={simulationResults}
              eacoResults={simulationResults?.eaco}
              epsoResults={simulationResults?.epso}
              plotData={{
                eaco: simulationResults?.eaco?.plotData,
                epso: simulationResults?.epso?.plotData
              }}
              plotsGenerating={simulationResults?.plotsGenerating || false}
              onBackToAnimation={() => setSimulationState('animation')}
              onNewSimulation={() => setSimulationState('config')}
              plotAnalysis={{
                eaco: simulationResults?.eaco?.plotAnalysis,
                epso: simulationResults?.epso?.plotAnalysis
              }}
            />
          </Suspense>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="flex flex-col min-h-screen font-sans bg-gradient-to-b from-white to-[#e0f7f6]"
    >
      <Header 
        simulationState={simulationState}
        activeTab={activeTab}
        onBack={onBack}
        onGoToConfig={() => setSimulationState('config')}
      />

      {renderContent()}
      
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        confirmText="Continue"
        cancelText="Cancel"
      />
      
      {isSaving && (
        <div className="fixed bottom-4 left-4 bg-white shadow-lg px-4 py-2 rounded-lg">
          Saving...
        </div>
      )}
      {lastSaved && !isSaving && simulationState === 'config' && (
        <div className="fixed bottom-4 left-4 bg-white shadow-lg px-4 py-2 rounded-lg text-gray-600 text-sm">
          Last saved: {new Date(lastSaved).toLocaleTimeString()}
        </div>
      )}
    </motion.div>
  );
};

export default SimulationPage;