import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Info, Settings, BarChart2, Play } from 'lucide-react';
import DataCenterTab from '../components/DatacenterTab/DataCenterTab';
import WorkloadTab from '../components/WorkloadTab/WorkloadTab';
import AnimationTab from '../components/AnimationTab/AnimationTab';
import ResultsTab from '../components/ResultsTab/ResultsTab';
import HelpTab from '../components/HelpTab/HelpTab';
import HistoryTab from '../components/HistoryTab/HistoryTab';
import CloudLoadingModal from '../components/modals/CloudLoadingModal';

const SimulationPage = ({ onBack }) => {
  // Configuration states
  const [activeTab, setActiveTab] = useState('dataCenter');
  const [simulationState, setSimulationState] = useState('config');
  const [selectedPreset, setSelectedPreset] = useState('');
  const [progress, setProgress] = useState(0);

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

  const [workloadFile, setWorkloadFile] = useState(null);
  const [csvRowCount, setCsvRowCount] = useState(0);
  const [simulationResults, setSimulationResults] = useState(null);
  const [direction, setDirection] = useState(1);

  // Tab order for animation direction
  const tabOrder = ['dataCenter', 'workload', 'history', 'help'];

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
    setDataCenterConfig(prev => ({
      ...prev,
      [name]: name === 'optimizationAlgorithm' ? value : Number(value)
    }));
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
      alert('Please upload a valid CSV file');
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
      .catch(() => alert('Failed to load preset workload'));
  };

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
      // Use MATLAB plots endpoint if requested
      if (withPlots && !workloadFile) {
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
              console.log('MATLAB engine is warming up, retrying in 5 seconds...');
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
        
        const response = await fetch(`${API_BASE}/api/run-with-file`, {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          let errorText = await response.text();
          throw new Error(`Server responded with ${response.status} for ${algorithm}: ${errorText}`);
        }
        
        return await response.json();
      } else {
        const response = await fetch(`${API_BASE}/api/run`, {
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
        
        return await response.json();
      }
    } catch (error) {
      console.error(`Error running ${algorithm}:`, error);
      throw error;
    }
  };

  const handleRunSimulation = async () => {
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
      useDefaultWorkload: !workloadFile
    };
    
    try {
      let progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev < 10) return prev + 2; // Initial setup
          if (prev < 30) return prev + 1.5; // Scheduling phase
          if (prev < 60) return prev + 0.8; // Simulation phase (slower)
          if (prev < 90) return prev + 0.5; // MATLAB analysis (slowest)
          if (prev >= 95) return prev;
          return prev + 0.3; // Final phase
        });
      }, 500);
      
      try {
        const eacoResponse = await runAlgorithm("EACO", configData, enableMatlabPlots);
        console.log('📊 EACO Response from backend:', eacoResponse);
        setProgress(70);
        const epsoResponse = await runAlgorithm("EPSO", configData, enableMatlabPlots);
        console.log('📊 EPSO Response from backend:', epsoResponse);
        
        const combinedResults = {
          eaco: eacoResponse,
          epso: epsoResponse
        };
        
        console.log('📊 Combined Results to be saved:', combinedResults);
        setSimulationResults(combinedResults);
        saveToHistory(combinedResults);
        
        clearInterval(progressInterval);
        setProgress(100);
        
        setTimeout(() => {
          setSimulationState('animation');
        }, 500);
      } catch (algorithmError) {
        console.error('Error running algorithms:', algorithmError);
        clearInterval(progressInterval);
        alert(`Failed to run algorithms: ${algorithmError.message}`);
        setSimulationState('config');
      }
    } catch (err) {
      console.error('Simulation run error:', err);
      alert(`Failed to run simulation: ${err.message}`);
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
                  console.log('Synthetic workload config:', config);
                  // Handle synthetic workload submission
                }}
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
                    alert('Unable to load complete results. This may be an old history entry.');
                  }
                }}
              />
            ) : (
              <HelpTab />
            )}
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
                console.log('📋 Transitioning to Results Tab');
                console.log('📋 Current simulationResults:', simulationResults);
                setSimulationState('results');
              }}
            />
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