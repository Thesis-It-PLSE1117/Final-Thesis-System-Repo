import { useState, useEffect, lazy, Suspense, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { showNotification } from '../components/common/ErrorNotification';
import { useAutoSave } from '../hooks/useAutoSave';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

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
    canAbort,
    currentIteration,
    totalIterations,
    iterationStage
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
  
  // Enhanced clear preset function that also clears file input
  const enhancedClearPreset = useCallback(() => {
    config.clearPreset();
    // Clear the file input if it exists
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [config]);

  // Enhanced clear workload file function that also clears file input
  const enhancedClearWorkloadFile = useCallback(() => {
    config.clearWorkloadFile();
    // Clear the file input if it exists
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [config]);
  
  const executeSimulation = useCallback(async () => {
    if (isCoolingDown) return;
    
    try {
      const isDeployedEnvironment = !window.location.hostname.includes('localhost');
      const totalOperations = config.dataCenterConfig.numVMs * effectiveCloudletCount * config.iterationConfig.iterations;
      
      if (isDeployedEnvironment && effectiveCloudletCount >= 5000) {
        setConfirmDialog({
          isOpen: true,
          title: 'Large Simulation Detected',
          message: `This simulation contains ${effectiveCloudletCount.toLocaleString()} tasks, which may exceed the deployment platform's timeout limits.`,
          type: 'warning',
          confirmText: 'Continue Anyway',
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
          },
          children: (
            <div className="space-y-4 mt-2">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Clock className="text-amber-600 mt-0.5" size={18} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-amber-900 text-sm mb-1">Timeout Risk</h4>
                    <p className="text-amber-800 text-xs leading-relaxed">
                      Online deployment has a 5-minute timeout limit. Large simulations may not complete in time.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#319694]/5 border border-[#319694]/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-[#319694] mt-0.5" size={18} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">Recommended Options</h4>
                    <ul className="space-y-1.5 text-xs text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-[#319694] font-bold">•</span>
                        <span>Use the <strong>1k-tasks preset</strong> for optimal performance online</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#319694] font-bold">•</span>
                        <span>Run <strong>single iteration</strong> instead of comparison mode for faster results</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#319694] font-bold">•</span>
                        <span>For large-scale testing, <strong>clone the repository</strong> and run locally</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )
        });
        return;
      }
      
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
          fileInputRef={fileInputRef}
          clearWorkloadFile={enhancedClearWorkloadFile}
          clearPreset={enhancedClearPreset}
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
              currentIteration={currentIteration}
              iterationStage={iterationStage}
              totalTasks={effectiveCloudletCount}
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
        confirmText={confirmDialog.confirmText || "Continue"}
        cancelText="Cancel"
      >
        {confirmDialog.children}
      </ConfirmationDialog>
      
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
