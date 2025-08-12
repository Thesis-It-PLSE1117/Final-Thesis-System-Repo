import { useState, useEffect, lazy, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Undo, Redo } from 'lucide-react';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { showNotification } from '../components/common/ErrorNotification';
import { useAutoSave } from '../hooks/useAutoSave';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import ProgressSteps from '../components/common/ProgressSteps';

// components
import Header from '../components/SimulationPage/Header';
import TabNav from '../components/SimulationPage/TabNav';

// custom hooks i created for simplicity
import { useSimulationConfig } from '../hooks/useSimulationConfig';
import { useUndoRedoConfig } from '../hooks/useUndoRedoConfig';
import { useSimulationRunner } from '../hooks/useSimulationRunner';

// lazy load tabs since you know for the sake of faster initial load
const DataCenterTab = lazy(() => import('../components/DatacenterTab/DataCenterTab'));
const WorkloadTab = lazy(() => import('../components/WorkloadTab/WorkloadTab'));
const IterationTab = lazy(() => import('../components/IterationTab/IterationTab'));
const AnimationTab = lazy(() => import('../components/AnimationTab/AnimationTab'));
const ResultsTab = lazy(() => import('../components/ResultsTab/ResultsTab'));
const HelpTab = lazy(() => import('../components/HelpTab/HelpTab'));
const HistoryTab = lazy(() => import('../components/HistoryTab/HistoryTab'));

import CloudLoadingModal from '../components/modals/CloudLoadingModal';
import * as historyService from '../services/historyService';

const SimulationPage = ({ onBack }) => {
  // i use custom hooks since you know for the sake of keeping this component simple
  const config = useSimulationConfig();
  const {
    simulationResults,
    setSimulationResults,
    progress,
    setProgress,
    simulationState,
    setSimulationState,
    runSimulation
  } = useSimulationRunner();
  
  // ui states
  const [activeTab, setActiveTab] = useState('dataCenter');
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const fileInputRef = useRef(null);
  
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
  const [animateProgress, setAnimateProgress] = useState(false);
  const [direction, setDirection] = useState(0);
  
  // computed values
  const completedConfigs = [
    Object.keys(config.dataCenterConfig).length > 0,
    config.cloudletConfig.numCloudlets > 0 || config.workloadFile !== null,
    config.iterationConfig.iterations > 0
  ].filter(Boolean).length;

  const configProgress = Math.round((completedConfigs / 3) * 100);
  
  // auto-save configuration
  const saveableConfig = config.getAllConfig();
  const { isSaving, lastSaved } = useAutoSave(saveableConfig, simulationState === 'config');

  // i check for saved config since you know for the sake of resuming work
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
  
  // i update progress step since you know for the sake of showing user where they are
  useEffect(() => {
    if (simulationState === 'config') {
      switch (activeTab) {
        case 'dataCenter': setWorkflowStep(0); break;
        case 'workload': setWorkflowStep(1); break;
        case 'iterations': setWorkflowStep(2); break;
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
  
  const executeSimulation = async () => {
    // i validate before running since you know for the sake of preventing errors
    const totalOperations = config.dataCenterConfig.numVMs * config.cloudletConfig.numCloudlets * config.iterationConfig.iterations;
    if (totalOperations > 100000) {
      setConfirmDialog({
        isOpen: true,
        title: 'Large Simulation Warning',
        message: `This simulation will process ${totalOperations.toLocaleString()} operations. This may take several minutes. Do you want to continue?`,
        onConfirm: async () => {
          setConfirmDialog({ isOpen: false });
          // i delegate to the hook since you know for the sake of keeping this simple
          await runSimulation({
            dataCenterConfig: config.dataCenterConfig,
            cloudletConfig: config.cloudletConfig,
            iterationConfig: config.iterationConfig,
            enableMatlabPlots: config.enableMatlabPlots,
            workloadFile: config.workloadFile
          });
        },
      });
      return;
    }
    
    await runSimulation({
      dataCenterConfig: config.dataCenterConfig,
      cloudletConfig: config.cloudletConfig,
      iterationConfig: config.iterationConfig,
      enableMatlabPlots: config.enableMatlabPlots,
      workloadFile: config.workloadFile
    });
  };
  
  const tabOrder = ['dataCenter', 'workload', 'iterations', 'history', 'help'];
  
  const handleTabChange = (newTab) => {
    const currentIndex = tabOrder.indexOf(activeTab);
    const newIndex = tabOrder.indexOf(newTab);
    setDirection(newIndex > currentIndex ? 1 : -1);
    setActiveTab(newTab);
  };
  
  // keyboard shortcuts
  useKeyboardShortcuts(
    {
      'num1': () => handleTabChange('dataCenter'),
      'num2': () => handleTabChange('workload'),
      'num3': () => handleTabChange('iterations'),
      'num4': () => handleTabChange('history'),
      'num5': () => handleTabChange('help'),
      'alt+left': () => {
        const currentIndex = tabOrder.indexOf(activeTab);
        const prevIndex = (currentIndex - 1 + tabOrder.length) % tabOrder.length;
        handleTabChange(tabOrder[prevIndex]);
      },
      'alt+right': () => {
        const currentIndex = tabOrder.indexOf(activeTab);
        const nextIndex = (currentIndex + 1) % tabOrder.length;
        handleTabChange(tabOrder[nextIndex]);
      },
      'ctrl+enter': () => {
        if (simulationState === 'config' && activeTab !== 'help' && activeTab !== 'history') {
          executeSimulation();
        }
      },
      'ctrl+z': handleUndo,
      'ctrl+y': handleRedo,
      'ctrl+s': (e) => {
        e.preventDefault();
        showNotification('Configuration saved', 'success', 2000);
      },
      '?': () => setShowKeyboardHelp(true),
      'escape': () => {
        if (showKeyboardHelp) {
          setShowKeyboardHelp(false);
        } else if (confirmDialog.isOpen) {
          setConfirmDialog({ isOpen: false });
        } else if (simulationState !== 'config') {
          setSimulationState('config');
        }
      }
    },
    [activeTab, simulationState, showKeyboardHelp, confirmDialog.isOpen]
  );
  
  // animation variants
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
  
  // render functions
  const renderConfigContent = () => (
    <>
      <TabNav activeTab={activeTab} onChange={handleTabChange} />

      <main className="flex-grow p-6 overflow-y-auto">
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
                  onChange={config.handleDataCenterChange}
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
                />
              )}
              {activeTab === 'iterations' && (
                <IterationTab
                  config={config.iterationConfig}
                  onChange={(newConfig) => {
                    // i handle the object format since you know for the sake of compatibility
                    config.setIterationConfig(newConfig);
                  }}
                />
              )}
              {activeTab === 'history' && (
                <HistoryTab 
                  onBack={() => setActiveTab('dataCenter')}
                  onViewResults={(result) => {
                    // i find paired results since you know for the sake of showing both algorithms
                    const pairedResults = historyService.getPairedHistoryResults(result.id);
                    
                    if (pairedResults) {
                      setSimulationResults(pairedResults);
                      setSimulationState('results');
                    } else {
                      showNotification('Unable to load complete results. This may be an old history entry.', 'info');
                    }
                  }}
                />
              )}
              {activeTab === 'help' && <HelpTab />}
            </Suspense>
          </motion.div>
        </AnimatePresence>

        {/* i show run button only on relevant tabs */}
        {activeTab === 'workload' && (
          <div className="mt-8 flex justify-center">
            <button
              className="bg-[#319694] text-white px-8 py-3 rounded-2xl text-lg shadow hover:bg-[#267b79] transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
              onClick={executeSimulation}
              disabled={!config.cloudletConfig.numCloudlets}
            >
              <Play size={18} />
              Run Simulation
            </button>
          </div>
        )}
      </main>
      
      {/* floating action buttons for undo/redo */}
      {simulationState === 'config' && (
        <div className="fixed bottom-8 right-8 flex gap-2">
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className="bg-white shadow-lg p-3 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo (Ctrl+Z)"
          >
            <Undo size={20} />
          </button>
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            className="bg-white shadow-lg p-3 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo (Ctrl+Y)"
          >
            <Redo size={20} />
          </button>
        </div>
      )}
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
              numCloudlets={config.cloudletConfig.numCloudlets}
              numHosts={config.dataCenterConfig.numHosts}
              numVMs={config.dataCenterConfig.numVMs}
              progress={progress}
              iterations={config.iterationConfig.iterations}
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
      
      {/* i show save status since you know for the sake of user confidence */}
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
