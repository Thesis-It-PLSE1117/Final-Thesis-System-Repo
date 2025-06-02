import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
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
    numHosts: 10,
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
    vmScheduler: "TimeShared",
    optimizationAlgorithm: "EPSO",
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
    // If clearing (no files), reset state and return early
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

  const runAlgorithm = async (algorithm, configData) => {
    const algorithmConfig = {
      ...configData,
      optimizationAlgorithm: algorithm
    };
    
    const isEpso = algorithm === "EPSO";
    const isEaco = algorithm === "EACO";
    
    if (isEpso) {
      console.group("🚀 EPSO ALGORITHM REQUEST");
      console.log("📊 Configuration:", JSON.stringify(algorithmConfig, null, 2));
      console.log("📁 Using workload file:", workloadFile ? workloadFile.name : "No file (using random workload)");
    } else if (isEaco) {
      console.group("🚀 EACO ALGORITHM REQUEST");
      console.log("📊 Configuration:", JSON.stringify(algorithmConfig, null, 2));
      console.log("📁 Using workload file:", workloadFile ? workloadFile.name : "No file (using random workload)");
    } else {
      console.log(`Running ${algorithm} algorithm with config:`, algorithmConfig);
    }
    
    try {
      if (workloadFile) {
        // Send with file - use the run-with-file endpoint as defined in the backend
        if (isEpso || isEaco) console.log("📤 Sending CSV file to backend via FormData");
        else console.log(`Using file upload mode with ${workloadFile.name}`);
        
        const formData = new FormData();
        formData.append('file', workloadFile);
        Object.entries(algorithmConfig).forEach(([key, value]) => {
          formData.append(key, value);
        });
        
        if (isEpso || isEaco) {
          console.log("📬 Form data entries:");
          for (let [key, value] of formData.entries()) {
            if (key === 'file') {
              console.log(`  - ${key}: ${value.name} (${value.size} bytes)`);
            } else {
              console.log(`  - ${key}: ${value}`);
            }
          }
          console.log("🌐 Endpoint: http://localhost:8080/api/run-with-file");
        } else {
          console.log("Sending form data:", [...formData.entries()]);
        }
        
        const startTime = Date.now();
        const response = await fetch('http://localhost:8080/api/run-with-file', {
          method: 'POST',
          body: formData
        });
        const requestTime = Date.now() - startTime;
        
        if (isEpso || isEaco) {
          console.log(`⏱️ Request completed in ${requestTime}ms`);
          console.log(`🛎️ Response status: ${response.status} ${response.statusText}`);
        } else {
          console.log(`Response status: ${response.status}`);
        }
        
        if (!response.ok) {
          let errorText = await response.text();
          console.error("Error response:", errorText);
          if (isEpso || isEaco) console.groupEnd();
          throw new Error(`Server responded with ${response.status} for ${algorithm}: ${errorText}`);
        }
        
        let responseData = await response.json();
        
        if (isEpso || isEaco) {
          console.log("✅ Received successful response from server");
          console.log("📊 Response summary:", {
            totalTasks: responseData.summary?.totalTasks || 'N/A',
            finishedTasks: responseData.summary?.finishedTasks || 'N/A',
            makespan: responseData.summary?.makespan || 'N/A',
            schedulingLogEntries: responseData.schedulingLog?.length || 0,
            vmUtilization: responseData.vmUtilization?.length || 0,
            energyConsumption: responseData.energyConsumption?.totalEnergyWh || 'N/A'
          });
          
          console.groupEnd();
        }
        
        return responseData;
      } else {
        // Send without file
        if (isEpso || isEaco) console.log("📤 Sending JSON request (no file)");
        else console.log(`Using default workload (no file)`);
        
        if (isEpso || isEaco) {
          console.log("📬 JSON payload:", JSON.stringify(algorithmConfig, null, 2));
          console.log("🌐 Endpoint: http://localhost:8080/api/run");
        }
        
        const startTime = Date.now();
        const response = await fetch('http://localhost:8080/api/run', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(algorithmConfig)
        });
        const requestTime = Date.now() - startTime;
        
        if (isEpso || isEaco) {
          console.log(`⏱️ Request completed in ${requestTime}ms`);
          console.log(`🛎️ Response status: ${response.status} ${response.statusText}`);
        } else {
          console.log(`Response status: ${response.status}`);
        }
        
        if (!response.ok) {
          let errorText = await response.text();
          console.error("Error response:", errorText);
          if (isEpso || isEaco) console.groupEnd();
          throw new Error(`Server responded with ${response.status} for ${algorithm}: ${errorText}`);
        }
        
        let responseData = await response.json();
        
        if (isEpso || isEaco) {
          console.log("✅ Received successful response from server");
          console.log("📊 Response summary:", {
            totalTasks: responseData.summary?.totalTasks || 'N/A',
            finishedTasks: responseData.summary?.finishedTasks || 'N/A',
            makespan: responseData.summary?.makespan || 'N/A',
            schedulingLogEntries: responseData.schedulingLog?.length || 0,
            vmUtilization: responseData.vmUtilization?.length || 0,
            energyConsumption: responseData.energyConsumption?.totalEnergyWh || 'N/A'
          });
          
          console.groupEnd();
        }
        
        return responseData;
      }
    } catch (error) {
      console.error(`Error running ${algorithm}:`, error);
      if (isEpso || isEaco) console.groupEnd();
      throw error;
    }
  };

  const handleRunSimulation = async () => {
    setSimulationState('loading');
    setProgress(0);
    
    // Create the configuration data to match backend @RequestParam exactly
    const configData = {
      // Required parameters from the backend code
      numHosts: dataCenterConfig.numHosts,
      numVMs: dataCenterConfig.numVMs,
      numPesPerHost: dataCenterConfig.numPesPerHost,
      peMips: dataCenterConfig.peMips,
      
      // Other parameters that might be needed
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
      
      // Set the workload type explicitly
      workloadType: workloadFile ? 'CSV' : 'Random',
      useDefaultWorkload: !workloadFile
    };
    
    console.group('🔄 Starting Simulation');
    console.log('📊 Sending configuration to backend:', configData);
    console.log('📁 Workload file:', workloadFile ? workloadFile.name : 'No file (using random workload)');
    
    try {
      let progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return prev;
          return prev + (5 + Math.random() * 10);
        });
      }, 300);
      
      // Run both algorithms
      try {
        // First run EACO algorithm
        console.group('🏆 Running EACO algorithm...');
        console.time('EACO execution time');
        const eacoResponse = await runAlgorithm("EACO", configData);
        console.timeEnd('EACO execution time');
        console.log('✅ EACO algorithm completed successfully');
        console.groupEnd();
        
        // Update progress
        setProgress(70);
        
        // Then run EPSO
        console.group('🏆 Running EPSO algorithm...');
        console.time('EPSO execution time');
        const epsoResponse = await runAlgorithm("EPSO", configData);
        console.timeEnd('EPSO execution time');
        console.log('✅ EPSO algorithm completed successfully');
        console.groupEnd();
        
        // Combine results for the simulation
        const combinedResults = {
          eaco: eacoResponse,
          epso: epsoResponse
        };
        
        // Log the detailed results
        console.group('📈 Algorithm Comparison');
        
        // Log EACO metrics
        console.log('🧮 EACO Metrics:');
        console.table({
          makespan: eacoResponse.summary.makespan.toFixed(2),
          imbalanceDegree: eacoResponse.summary.imbalanceDegree.toFixed(4),
          resourceUtilization: (eacoResponse.summary.resourceUtilization * 100).toFixed(2) + '%',
          averageResponseTime: eacoResponse.summary.averageResponseTime.toFixed(2)
        });
        
        // Log EPSO metrics
        console.log('🧮 EPSO Metrics:');
        console.table({
          makespan: epsoResponse.summary.makespan.toFixed(2),
          imbalanceDegree: epsoResponse.summary.imbalanceDegree.toFixed(4),
          resourceUtilization: (epsoResponse.summary.resourceUtilization * 100).toFixed(2) + '%',
          averageResponseTime: epsoResponse.summary.averageResponseTime.toFixed(2)
        });
        
        // Log energy consumption for both algorithms
        console.log('⚡ Energy Consumption (Wh):');
        console.table([
          {
            Algorithm: 'EACO',
            TotalEnergyWh: eacoResponse.energyConsumption?.totalEnergyWh ?? eacoResponse.energyConsumption ?? 'N/A'
          },
          {
            Algorithm: 'EPSO',
            TotalEnergyWh: epsoResponse.energyConsumption?.totalEnergyWh ?? epsoResponse.energyConsumption ?? 'N/A'
          }
        ]);
        
        // Log VM utilization details
        console.group('📊 VM Utilization Details');
        console.log('EPSO VM Utilization:');
        console.table(epsoResponse.vmUtilization.map(vm => ({
          VM_ID: vm.vmId,
          CPU_Load: vm.cpuUtilization.toFixed(2),
          Tasks: vm.numAPECloudlets,
          Status: vm.cpuUtilization > 0 ? 'Active' : 'Idle'
        })));
        
        console.log('EACO VM Utilization:');
        console.table(eacoResponse.vmUtilization.map(vm => ({
          VM_ID: vm.vmId,
          CPU_Load: vm.cpuUtilization.toFixed(2),
          Tasks: vm.numAPECloudlets,
          Status: vm.cpuUtilization > 0 ? 'Active' : 'Idle'
        })));
        console.groupEnd();
        
        // Log performance improvement comparison
        const makespanImprovement = ((eacoResponse.summary.makespan - epsoResponse.summary.makespan) / eacoResponse.summary.makespan * 100);
        const imbalanceImprovement = ((eacoResponse.summary.imbalanceDegree - epsoResponse.summary.imbalanceDegree) / eacoResponse.summary.imbalanceDegree * 100);
        
        console.log('🔄 Performance Comparison (EPSO vs EACO):');
        console.table({
          'Makespan Change': makespanImprovement > 0 ? 
            `${makespanImprovement.toFixed(2)}% better with EPSO` : 
            `${Math.abs(makespanImprovement).toFixed(2)}% better with EACO`,
          'Imbalance Change': imbalanceImprovement > 0 ? 
            `${imbalanceImprovement.toFixed(2)}% better with EPSO` : 
            `${Math.abs(imbalanceImprovement).toFixed(2)}% better with EACO`
        });
        
        console.groupEnd(); // End Algorithm Comparison
        
        // Store the combined results
        setSimulationResults(combinedResults);
        
        // Clear the interval and finish loading
        clearInterval(progressInterval);
        setProgress(100);
        
        // Short delay before moving to animation view
        setTimeout(() => {
          console.log('👍 Both algorithms completed successfully. Moving to animation view.');
          console.groupEnd(); // End Starting Simulation
          setSimulationState('animation');
        }, 500);
      } catch (algorithmError) {
        console.error('❌ Error running algorithms:', algorithmError);
        console.groupEnd(); // End nested group
        console.groupEnd(); // End Starting Simulation
        clearInterval(progressInterval);
        alert(`Failed to run algorithms: ${algorithmError.message}`);
        setSimulationState('config');
      }
    } catch (err) {
      console.error('❌ Simulation run error:', err);
      console.groupEnd(); // End Starting Simulation
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
              rrResults={simulationResults?.eaco}
              epsoResults={simulationResults?.epso}
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
              rrResults={simulationResults?.eaco}
              epsoResults={simulationResults?.epso}
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