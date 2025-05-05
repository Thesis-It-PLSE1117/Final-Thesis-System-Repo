import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Info, Settings, BarChart2, Play } from 'lucide-react';
import DataCenterTab from '../components/DataCenterTab';
import WorkloadTab from '../components/WorkloadTab';
import AnimationTab from '../components/AnimationTab';
import ResultsTab from '../components/ResultsTab';
import HelpTab from '../components/HelpTab';
import CloudLoadingModal from '../components/CloudLoadingModal';

const SimulationPage = ({ onBack }) => {
  // Configuration states
  const [activeTab, setActiveTab] = useState('dataCenter');
  const [simulationState, setSimulationState] = useState('config');
  const [selectedPreset, setSelectedPreset] = useState('');
  const [progress, setProgress] = useState(0);

  // Data center configuration
  const [dataCenterConfig, setDataCenterConfig] = useState({
    numHosts: 1,
    numPesPerHost: 2,
    peMips: 2000,
    ramPerHost: 2048,
    bwPerHost: 10000,
    storagePerHost: 100000,
    numVMs: 10,
    vmMips: 1000,
    vmPes: 2,
    vmRam: 1024,
    vmBw: 1000,
    vmSize: 10000,
    optimizationAlgorithm: "RoundRobin",
  });

  // Workload configuration
  const [cloudletConfig, setCloudletConfig] = useState({
    numCloudlets: 100,
  });

  const [workloadFile, setWorkloadFile] = useState(null);
  const [csvRowCount, setCsvRowCount] = useState(0);
  const [simulationResults, setSimulationResults] = useState(null);
  const [direction, setDirection] = useState(1);

  // Tab order for animation direction
  const tabOrder = ['dataCenter', 'workload', 'help'];

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
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
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

  const handleRunSimulation = () => {
    setSimulationState('loading');
    setProgress(0);
    
    // Simulate progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (10 + Math.random() * 15);
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setSimulationState('animation');
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);

    return () => clearInterval(interval);
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
              />
            ) : (
              <HelpTab />
            )}
          </motion.div>
        </AnimatePresence>

        {activeTab !== 'help' && (
          <div className="mt-8 flex justify-center">
            <button
              className="bg-[#319694] text-white px-8 py-3 rounded-2xl text-lg shadow hover:bg-[#267b79] transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
              onClick={handleRunSimulation}
              disabled={!workloadFile}
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
              onBack={() => setSimulationState('config')}
              onViewResults={() => setSimulationState('results')}
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
        return 'Simulation Configuration';
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
        return 'Set up your data center and workload parameters';
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
        return <Settings size={24} className="text-white" />;
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