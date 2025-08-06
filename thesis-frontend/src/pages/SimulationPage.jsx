import { useState, useEffect, lazy, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Info, Settings, BarChart2, Play, Repeat, Undo, Redo, Save, HelpCircle } from 'lucide-react';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { showNotification } from '../components/common/ErrorNotification';
import { useAutoSave } from '../hooks/useAutoSave';
import UndoRedoManager from '../utils/undoRedoManager';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import ProgressSteps from '../components/common/ProgressSteps';

// Lazy load tabs
const DataCenterTab = lazy(() => import('../components/DatacenterTab/DataCenterTab'));
const WorkloadTab = lazy(() => import('../components/WorkloadTab/WorkloadTab'));
const IterationTab = lazy(() => import('../components/IterationTab/IterationTab'));
const AnimationTab = lazy(() => import('../components/AnimationTab/AnimationTab'));
const ResultsTab = lazy(() => import('../components/ResultsTab/ResultsTab'));
const HelpTab = lazy(() => import('../components/HelpTab/HelpTab'));
const HistoryTab = lazy(() => import('../components/HistoryTab/HistoryTab'));

import CloudLoadingModal from '../components/modals/CloudLoadingModal';
import { validateSimulationConfig, sanitizeNumericInput, validateCSVFile } from '../utils/validation';
import { safeJsonParse } from '../utils/security';
import { getHistory, saveToHistory, clearHistory } from '../utils/storageManager';

const SimulationPage = ({ onBack }) => {
  // Configuration states
  const [activeTab, setActiveTab] = useState('dataCenter');
  const [simulationState, setSimulationState] = useState('config');
  const [selectedPreset, setSelectedPreset] = useState('');
  const [progress, setProgress] = useState(0);
  
  // Undo/Redo management
  const undoRedoManager = useRef(new UndoRedoManager());
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  
  // Confirmation dialogs
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, action: null });
  
  // Progress tracking for workflow
  const [workflowStep, setWorkflowStep] = useState(0);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  // Data center configuration
  const [dataCenterConfig, setDataCenterConfig] = useState({
    numHosts: 10,
    numPesPerHost: 2,
    peMips: 2000,
    ramPerHost: 2048,
    bwPerHost: 10000,
    storagePerHost: 100000,
    numVMs: 50,
    vmMips: 1000,
    vmPes: 2,
    vmRam: 1024,
    vmBw: 1000,
    vmSize: 10000,
    vmScheduler: "TimeShared",
    optimizationAlgorithm: "EPSO",
  });
  
  // Additional configuration for MATLAB plots
  const [enableMatlabPlots, setEnableMatlabPlots] = useState(false);

  // Workload configuration
  const [cloudletConfig, setCloudletConfig] = useState({
    numCloudlets: 100,
  });
  
  // Iteration configuration
  const [iterationConfig, setIterationConfig] = useState({
    iterations: 1,
  });

  const [workloadFile, setWorkloadFile] = useState(null);
  const [csvRowCount, setCsvRowCount] = useState(0);
  const [simulationResults, setSimulationResults] = useState(null);
  const [direction, setDirection] = useState(1);
  
  // Auto-save configuration
  const configData = {
    dataCenterConfig,
    cloudletConfig,
    iterationConfig,
    enableMatlabPlots,
    selectedPreset
  };
  
  const { isSaving, lastSaved, loadAutoSave, clearAutoSave } = useAutoSave(
    configData,
    'simulation-config',
    3000 // 3 second delay
  );
  
  // Initialize undo/redo manager
  useEffect(() => {
    const unsubscribe = undoRedoManager.current.subscribe((state) => {
      setCanUndo(state.canUndo);
      setCanRedo(state.canRedo);
    });
    undoRedoManager.current.push(configData);
    
    return unsubscribe;
  }, []);
  
  useEffect(() => {
    if (undoRedoManager.current) {
      undoRedoManager.current.push(configData);
    }
  }, [dataCenterConfig, cloudletConfig, iterationConfig, enableMatlabPlots]);

  useEffect(() => {
    const saved = loadAutoSave();
    if (saved && saved.data) {
      setConfirmDialog({
        isOpen: true,
        action: 'loadAutoSave',
        title: 'Restore Auto-saved Configuration',
        message: `Would you like to restore your configuration from ${new Date(saved.timestamp).toLocaleString()}?`,
        type: 'info',
        onConfirm: () => {
          setDataCenterConfig(saved.data.dataCenterConfig);
          setCloudletConfig(saved.data.cloudletConfig);
          setIterationConfig(saved.data.iterationConfig);
          setEnableMatlabPlots(saved.data.enableMatlabPlots);
          setSelectedPreset(saved.data.selectedPreset || '');
          showNotification('Configuration restored successfully', 'success');
        }
      });
    }
  }, []);
  
  // Workflow steps
  const workflowSteps = [
    { id: 'datacenter', label: 'Data Center', sublabel: 'Configure infrastructure' },
    { id: 'workload', label: 'Workload', sublabel: 'Set up tasks' },
    { id: 'iterations', label: 'Iterations', sublabel: 'Configure runs' },
    { id: 'run', label: 'Run', sublabel: 'Execute simulation' }
  ];
  
  useEffect(() => {
    const stepMap = {
      'dataCenter': 0,
      'workload': 1,
      'iterations': 2
    };
    setWorkflowStep(stepMap[activeTab] || 0);
  }, [activeTab]);

  const tabOrder = ['dataCenter', 'workload', 'iterations', 'history', 'help'];

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

  // Handlers
  const handleTabChange = (newTab) => {
    const currentIndex = tabOrder.indexOf(activeTab);
    const newIndex = tabOrder.indexOf(newTab);
    setDirection(newIndex > currentIndex ? 1 : -1);
    setActiveTab(newTab);
  };

  const handleDataCenterChange = (e) => {
    const { name, value } = e.target;
    
    const errors = validateSimulationConfig({ ...dataCenterConfig, [name]: value });
    if (Object.keys(errors).length > 0) {
      showNotification(Object.values(errors)[0], 'warning');
      return;
    }
    
    if (name === 'optimizationAlgorithm' || name === 'vmScheduler') {
      setDataCenterConfig(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setDataCenterConfig(prev => ({
        ...prev,
        [name]: Number(value)
      }));
    }
  };

  const handleCloudletChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === 'numCloudlets' && csvRowCount > 0 
      ? Math.min(Number(value), csvRowCount)
      : value;

    setCloudletConfig(prev => ({
      ...prev,
      [name]: Number(newValue)
    }));
  };

  const handleFileUpload = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setWorkloadFile(null);
      setCsvRowCount(0);
      return;
    }
    const file = e.target.files[0];
    if (file && (file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv'))) {
      setSelectedPreset('');
      setWorkloadFile(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const rows = text.split('\n').filter(row => row.trim() !== '');
        const rowCount = rows.length - 1;

        setCsvRowCount(rowCount);
        setCloudletConfig(prev => ({
          ...prev,
          numCloudlets: Math.min(prev.numCloudlets, rowCount)
        }));
      };
      reader.readAsText(file);
    } else {
      showNotification('Please upload a valid CSV file', 'warning');
    }
  };

  const handlePresetSelect = (presetName) => {
    setSelectedPreset(presetName);
    if (!presetName) return;

    fetch(`/presets/${presetName}`)
      .then(res => res.text())
      .then(text => {
        const rows = text.split('\n').filter(r => r.trim() !== '');
        const rowCount = rows.length - 1;

        const blob = new Blob([text], { type: 'text/csv' });
        const file = new File([blob], presetName, { type: 'text/csv' });

        setWorkloadFile(file);
        setCsvRowCount(rowCount);
        setCloudletConfig(prev => ({
          ...prev,
          numCloudlets: Math.min(prev.numCloudlets, rowCount)
        }));
      })
      .catch(() => showNotification('Failed to load preset workload', 'error'));
  };

  const handleUndo = () => {
    const previousState = undoRedoManager.current.undo();
    if (previousState) {
      setDataCenterConfig(previousState.dataCenterConfig);
      setCloudletConfig(previousState.cloudletConfig);
      setIterationConfig(previousState.iterationConfig);
      setEnableMatlabPlots(previousState.enableMatlabPlots);
      showNotification('Changes undone', 'info', 2000);
    }
  };
  
  const handleRedo = () => {
    const nextState = undoRedoManager.current.redo();
    if (nextState) {
      setDataCenterConfig(nextState.dataCenterConfig);
      setCloudletConfig(nextState.cloudletConfig);
      setIterationConfig(nextState.iterationConfig);
      setEnableMatlabPlots(nextState.enableMatlabPlots);
      showNotification('Changes redone', 'info', 2000);
    }
  };
  
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
          handleRunSimulation();
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
          setConfirmDialog({ isOpen: false, action: null });
        } else if (simulationState !== 'config') {
          setSimulationState('config');
        }
      }
    },
    [activeTab, simulationState, showKeyboardHelp, confirmDialog.isOpen]
  );

  // Base URL for backend API
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

  const saveToHistory = (results) => {
    const timestamp = new Date().toISOString();
    const id = Date.now();
    
    // Create full config object including cloudlet config
    const fullConfig = {
      ...dataCenterConfig,
      numCloudlets: cloudletConfig.numCloudlets,
      workloadType: workloadFile ? 'CSV' : 'Random'
    };
    
    const historyEntries = [
      {
        id: `${id}-eaco`,
        timestamp,
        algorithm: 'EACO',
        config: fullConfig,
        summary: results.eaco.rawResults?.summary || results.eaco.summary,
        energyConsumption: results.eaco.rawResults?.energyConsumption || results.eaco.energyConsumption,
        vmUtilization: results.eaco.rawResults?.vmUtilization || results.eaco.vmUtilization,
        schedulingLog: results.eaco.rawResults?.schedulingLog || results.eaco.schedulingLog,
        plotData: results.eaco.plotData,
        simulationId: results.eaco.simulationId
      },
      {
        id: `${id}-epso`,
        timestamp,
        algorithm: 'EPSO',
        config: fullConfig,
        summary: results.epso.rawResults?.summary || results.epso.summary,
        energyConsumption: results.epso.rawResults?.energyConsumption || results.epso.energyConsumption,
        vmUtilization: results.epso.rawResults?.vmUtilization || results.epso.vmUtilization,
        schedulingLog: results.epso.rawResults?.schedulingLog || results.epso.schedulingLog,
        plotData: results.epso.plotData,
        simulationId: results.epso.simulationId
      }
    ];

    const existingHistory = JSON.parse(localStorage.getItem('simulationHistory') || '[]');
    const updatedHistory = [...historyEntries, ...existingHistory].slice(0, 50);
    localStorage.setItem('simulationHistory', JSON.stringify(updatedHistory));
  };

  const runAlgorithm = async (algorithm, configData, withPlots = false) => {
    const algorithmConfig = {
      ...configData,
      optimizationAlgorithm: algorithm
    };
    
    try {
      // need to use the iterations 
      const useIterations = configData.iterations > 1;
      
      // if matlabs requested
      if (withPlots && !workloadFile && !useIterations) {
        const response = await fetch(`${API_BASE}/api/simulate/with-plots`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(algorithmConfig)
        });
        
        if (!response.ok) {
          // Handle MATLAB warming up
          if (response.status === 202) {
            const data = await response.json();
            if (data.status === 'WARMING_UP') {
              await new Promise(resolve => setTimeout(resolve, 5000));
              // Retry the request
              return runAlgorithm(algorithm, configData, withPlots);
            }
          }
          let errorText = await response.text();
          throw new Error(`Server responded with ${response.status} for ${algorithm}: ${errorText}`);
        }
        
        const result = await response.json();
        // Return the entire result including rawResults and plotData
        return result;
      } else if (workloadFile) {
        const formData = new FormData();
        formData.append('file', workloadFile);
        Object.entries(algorithmConfig).forEach(([key, value]) => {
          formData.append(key, value);
        });
        
        // endpoints (iterations)
        const endpoint = useIterations ? '/api/run-iterations-with-file' : '/api/run-with-file';
        const response = await fetch(`${API_BASE}${endpoint}`, {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          let errorText = await response.text();
          throw new Error(`Server responded with ${response.status} for ${algorithm}: ${errorText}`);
        }
        
        const result = await response.json();
        // wrapper
        if (useIterations && result.totalIterations) {
          return {
            rawResults: result,
            summary: result.averageMetrics,
            isIterationResult: true
          };
        }
        return result;
      } else {
        // if > 1 
        const endpoint = useIterations ? '/api/run-iterations' : '/api/run';
        const response = await fetch(`${API_BASE}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(algorithmConfig)
        });
        
        if (!response.ok) {
          let errorText = await response.text();
          throw new Error(`Server responded with ${response.status} for ${algorithm}: ${errorText}`);
        }
        
        const result = await response.json();
            //wrapper
        if (useIterations && result.totalIterations) {
          return {
            rawResults: result,
            summary: result.averageMetrics,
            isIterationResult: true
          };
        }
        return result;
      }
    } catch (error) {
      throw error;
    }
  };

  const handleRunSimulation = async () => {
    // Validate configuration before running
    const errors = validateSimulationConfig({
      ...dataCenterConfig,
      ...cloudletConfig,
      ...iterationConfig
    });
    
    if (Object.keys(errors).length > 0) {
      showNotification(`Please fix configuration errors: ${Object.values(errors).join(', ')}`, 'error');
      return;
    }
    
    // Show confirmation dialog for large simulations
    const totalOperations = dataCenterConfig.numVMs * cloudletConfig.numCloudlets * iterationConfig.iterations;
    if (totalOperations > 100000) {
      setConfirmDialog({
        isOpen: true,
        action: 'runSimulation',
        title: 'Large Simulation Warning',
        message: `This simulation will process ${totalOperations.toLocaleString()} operations. This may take several minutes. Do you want to continue?`,
        type: 'warning',
        onConfirm: () => {
          executeSimulation();
        }
      });
      return;
    }
    
    executeSimulation();
  };
  
  const executeSimulation = async () => {
    setSimulationState('loading');
    setProgress(0);
    setWorkflowStep(3); // Move to 'Run' step
    
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
      // Adjust progress speed based on iterations
      const progressMultiplier = iterationConfig.iterations > 1 ? 0.6 : 1.0;
      
      let progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev < 10) return prev + (2 * progressMultiplier); // Initial setup
          if (prev < 30) return prev + (1.5 * progressMultiplier); // Scheduling phase
          if (prev < 60) return prev + (0.8 * progressMultiplier); // Simulation phase (slower)
          if (prev < 90) return prev + (0.5 * progressMultiplier); // Analysis phase (slowest)
          if (prev >= 95) return prev;
          return prev + (0.3 * progressMultiplier); // Final phase
        });
      }, 500);
      
      try {
        const eacoResponse = await runAlgorithm("EACO", configData, enableMatlabPlots);
        setProgress(70);
        const epsoResponse = await runAlgorithm("EPSO", configData, enableMatlabPlots);
        
        const combinedResults = {
          eaco: eacoResponse,
          epso: epsoResponse
        };
        setSimulationResults(combinedResults);
        saveToHistory(combinedResults);
        
        clearInterval(progressInterval);
        setProgress(100);
        
        setTimeout(() => {
          setSimulationState('animation');
        }, 500);
      } catch (algorithmError) {
        clearInterval(progressInterval);
        showNotification(`Failed to run algorithms: ${algorithmError.message}`, 'error');
        setSimulationState('config');
      }
    } catch (err) {
      showNotification(`Failed to run simulation: ${err.message}`, 'error');
      setSimulationState('config');
    }
  };

  // Render functions
  const renderConfigContent = () => (
    <>
      <div className="flex border-b border-gray-200 px-6">
        <button
          className={`py-4 px-6 font-medium flex items-center gap-2 ${activeTab === 'dataCenter' ? 'text-[#319694] border-b-2 border-[#319694]' : 'text-gray-500'}`}
          onClick={() => handleTabChange('dataCenter')}
        >
          <Settings size={18} />
          Data Center
        </button>
        <button
          className={`py-4 px-6 font-medium flex items-center gap-2 ${activeTab === 'workload' ? 'text-[#319694] border-b-2 border-[#319694]' : 'text-gray-500'}`}
          onClick={() => handleTabChange('workload')}
        >
          <Play size={18} />
          Workload
        </button>
        <button
          className={`py-4 px-6 font-medium flex items-center gap-2 ${activeTab === 'iterations' ? 'text-[#319694] border-b-2 border-[#319694]' : 'text-gray-500'}`}
          onClick={() => handleTabChange('iterations')}
        >
          <Repeat size={18} />
          Iterations
        </button>
        <button
          className={`py-4 px-6 font-medium flex items-center gap-2 ${activeTab === 'history' ? 'text-[#319694] border-b-2 border-[#319694]' : 'text-gray-500'}`}
          onClick={() => handleTabChange('history')}
        >
          <BarChart2 size={18} />
          History
        </button>
        <button
          className={`py-4 px-6 font-medium flex items-center gap-2 ${activeTab === 'help' ? 'text-[#319694] border-b-2 border-[#319694]' : 'text-gray-500'}`}
          onClick={() => handleTabChange('help')}
        >
          <Info size={18} />
          Help
        </button>
      </div>

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
              {activeTab === 'dataCenter' ? (
                <DataCenterTab 
                  config={dataCenterConfig} 
                  onChange={handleDataCenterChange}
                  enableMatlabPlots={enableMatlabPlots}
                  onMatlabToggle={setEnableMatlabPlots}
                />
              ) : activeTab === 'workload' ? (
                <WorkloadTab
                  config={cloudletConfig}
                  onChange={handleCloudletChange}
                  onFileUpload={handleFileUpload}
                  workloadFile={workloadFile}
                  csvRowCount={csvRowCount}
                  onPresetSelect={handlePresetSelect}
                  selectedPreset={selectedPreset}
                  onSyntheticWorkloadSubmit={(config) => {
                    // Handle synthetic workload submission
                  }}
                />
              ) : activeTab === 'iterations' ? (
                <IterationTab 
                  config={iterationConfig}
                  onChange={setIterationConfig}
                />
              ) : activeTab === 'history' ? (
                <HistoryTab 
                  onBack={() => setActiveTab('dataCenter')}
                  onViewResults={(result) => {
                    // Find the corresponding paired result from the same simulation run
                    const savedHistory = JSON.parse(localStorage.getItem('simulationHistory') || '[]');
                    const baseId = result.id.split('-')[0];
                    
                    // Find both EACO and EPSO results from the same run
                    const eacoResult = savedHistory.find(r => r.id === `${baseId}-eaco`);
                    const epsoResult = savedHistory.find(r => r.id === `${baseId}-epso`);
                    
                    if (eacoResult && epsoResult) {
                      setSimulationResults({
                        eaco: eacoResult,
                        epso: epsoResult
                      });
                      setSimulationState('results');
                    } else {
                      // Fallback for single result (old format)
                      showNotification('Unable to load complete results. This may be an old history entry.', 'info');
                    }
                  }}
                />
              ) : (
                <HelpTab />
              )}
            </Suspense>
          </motion.div>
        </AnimatePresence>

        {activeTab !== 'help' && activeTab !== 'history' && (
          <div className="mt-8 flex justify-center">
            <button
              className="bg-[#319694] text-white px-8 py-3 rounded-2xl text-lg shadow hover:bg-[#267b79] transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
              onClick={handleRunSimulation}
            >
              <Play size={18} />
              Run Simulation
            </button>
          </div>
        )}
      </main>
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
              numCloudlets={cloudletConfig.numCloudlets}
              numHosts={dataCenterConfig.numHosts}
              numVMs={dataCenterConfig.numVMs}
              progress={progress}
              iterations={iterationConfig.iterations}
            />
          </>
        );

      case 'animation':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Suspense fallback={
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#319694]"></div>
              </div>
            }>
              <AnimationTab 
                dataCenterConfig={dataCenterConfig}
                cloudletConfig={{
                  ...cloudletConfig,
                  numCloudlets: csvRowCount > 0 
                    ? Math.min(cloudletConfig.numCloudlets, csvRowCount)
                    : cloudletConfig.numCloudlets
                }}
                workloadFile={workloadFile}
                eacoResults={simulationResults?.eaco}
                epsoResults={simulationResults?.epso}
                onBack={() => setSimulationState('config')}
                onViewResults={() => {
                  setSimulationState('results');
                }}
              />
            </Suspense>
          </motion.div>
        );

      case 'results':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
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
                onBackToAnimation={() => setSimulationState('animation')}
                onNewSimulation={() => setSimulationState('config')}
              />
            </Suspense>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const getHeaderTitle = () => {
    switch (simulationState) {
      case 'config':
        return activeTab === 'history' ? 'Results History' : 'Simulation Configuration';
      case 'loading':
        return 'Running Simulation';
      case 'animation':
        return 'Distribution Visualization';
      case 'results':
        return 'Result Analysis';
      default:
        return 'Cloud Simulation';
    }
  };

  const getHeaderSubtitle = () => {
    switch (simulationState) {
      case 'config':
        return activeTab === 'history' 
          ? 'View past simulation results and configurations' 
          : 'Set up your data center and workload parameters';
      case 'loading':
        return 'Processing your cloud workload';
      case 'animation':
        return 'Visualizing the task scheduling process';
      case 'results':
        return 'Analyze the performance metrics';
      default:
        return '';
    }
  };

  const getHeaderIcon = () => {
    switch (simulationState) {
      case 'config':
        return activeTab === 'history' 
          ? <BarChart2 size={24} className="text-white" />
          : <Settings size={24} className="text-white" />;
      case 'loading':
        return <Play size={24} className="text-white animate-pulse" />;
      case 'animation':
        return <Play size={24} className="text-white" />;
      case 'results':
        return <BarChart2 size={24} className="text-white" />;
      default:
        return <Home size={24} className="text-white" />;
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
      <header className="bg-[#319694] w-full shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center">
            <button 
              onClick={onBack} 
              className="text-white hover:bg-[#267b79] p-2 rounded-lg mr-4"
              aria-label="Return to home page"
            >
              <Home size={24} />
            </button>
            
            <div className="flex items-center gap-3 flex-grow">
              <div className="bg-white/20 p-2 rounded-lg">
                {getHeaderIcon()}
              </div>
              <div className="flex flex-col">
                <h1 className="text-white text-xl md:text-2xl font-bold">
                  {getHeaderTitle()}
                </h1>
                <p className="text-[#c8f0ef] text-xs md:text-sm">
                  {getHeaderSubtitle()}
                </p>
              </div>
            </div>
            
            {simulationState !== 'config' && simulationState !== 'loading' && (
              <button
                onClick={() => setSimulationState('config')}
                className="text-white hover:bg-[#267b79] px-4 py-2 rounded-lg transition-all flex items-center gap-2"
              >
                <Settings size={18} />
                <span className="hidden md:inline">Configuration</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {renderContent()}
    </motion.div>
  );
};

export default SimulationPage;