import { useEffect, useRef, useState } from 'react';
import VMCard from './VMCard';
import MetricsPanel from './MetricsPanel';
import Controls from './Controls';
import { motion, AnimatePresence } from 'framer-motion';

const AnimationTab = ({ dataCenterConfig, cloudletConfig, workloadFile, onBack, onViewResults, rrResults, epsoResults }) => {
  const [activeAlgorithm, setActiveAlgorithm] = useState('EPSO');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeVMs, setActiveVMs] = useState({ EPSO: [], EACO: [] });
  const [taskCounts, setTaskCounts] = useState({ EPSO: {}, EACO: {} });
  const [cpuLoads, setCpuLoads] = useState({ EPSO: {}, EACO: {} });
  const [totalTasks, setTotalTasks] = useState(0);
  const animationRef = useRef(null);
  const [metrics, setMetrics] = useState({
    EPSO: { imbalance: 0, makespan: 0, utilization: 0 },
    EACO: { imbalance: 0, makespan: 0, utilization: 0 }
  });
  const [showResultsButton, setShowResultsButton] = useState(true);
  const [highlightedVM, setHighlightedVM] = useState({ EPSO: null, EACO: null });

  // Load backend results
  useEffect(() => {
    if (epsoResults && rrResults) {
      console.group('Backend Response Data');
      console.log('🚀 EPSO Results Received:', epsoResults);
      console.log('🚀 EACO Results Received:', rrResults);
      console.groupEnd();

      console.group('Resource Utilization Comparison');
      console.log('Simulation Results (Backend):');
      console.log('EPSO:', {
        imbalance: epsoResults.summary.imbalanceDegree,
        makespan: epsoResults.summary.makespan,
        utilization: epsoResults.summary.resourceUtilization * 100
      });
      console.log('EACO:', {
        imbalance: rrResults.summary.imbalanceDegree,
        makespan: rrResults.summary.makespan,
        utilization: rrResults.summary.resourceUtilization * 100
      });
      
      console.log('\nAnimation Initial State:');
      console.log('EPSO VMs:', epsoResults.vmUtilization.map(vm => ({
        id: vm.vmId,
        load: vm.cpuUtilization,
        tasks: vm.numAPECloudlets
      })));
      console.log('EACO VMs:', rrResults.vmUtilization.map(vm => ({
        id: vm.vmId,
        load: vm.cpuUtilization,
        tasks: vm.numAPECloudlets
      })));
      console.groupEnd();

      // Set metrics from backend data
      setMetrics({
        EPSO: {
          imbalance: epsoResults.summary.imbalanceDegree.toFixed(2),
          makespan: epsoResults.summary.makespan.toFixed(2),
          utilization: (epsoResults.summary.resourceUtilization * 100).toFixed(2)
        },
        EACO: {
          imbalance: rrResults.summary.imbalanceDegree.toFixed(2),
          makespan: rrResults.summary.makespan.toFixed(2),
          utilization: (rrResults.summary.resourceUtilization * 100).toFixed(2)
        }
      });

      // Prepare VM utilization data
      const epsoLoads = {};
      const eacoLoads = {};
      const epsoCounts = {};
      const eacoCounts = {};
      const epsoActive = [];
      const eacoActive = [];

      // Process EPSO VM utilization
      epsoResults.vmUtilization.forEach(vm => {
        const vmId = vm.vmId;
        epsoLoads[vmId] = (vm.cpuUtilization / 100) || 0; // Scale to 0-1 range
        epsoCounts[vmId] = vm.numAPECloudlets || 0;
        if (vm.cpuUtilization > 0) epsoActive.push(vmId);
      });

      // Process EACO VM utilization
      rrResults.vmUtilization.forEach(vm => {
        const vmId = vm.vmId;
        eacoLoads[vmId] = (vm.cpuUtilization / 100) || 0; // Scale to 0-1 range
        eacoCounts[vmId] = vm.numAPECloudlets || 0;
        if (vm.cpuUtilization > 0) eacoActive.push(vmId);
      });

      // Set component state
      setCpuLoads({ EPSO: epsoLoads, EACO: eacoLoads });
      setTaskCounts({ EPSO: epsoCounts, EACO: eacoCounts });
      setActiveVMs({ EPSO: epsoActive, EACO: eacoActive });

      // Find VMs with highest load for highlighting
      let maxEpsoLoad = 0;
      let maxEpsoVmId = null;
      let maxEacoLoad = 0;
      let maxEacoVmId = null;

      epsoResults.vmUtilization.forEach(vm => {
        if (vm.cpuUtilization > maxEpsoLoad) {
          maxEpsoLoad = vm.cpuUtilization;
          maxEpsoVmId = vm.vmId;
        }
      });

      rrResults.vmUtilization.forEach(vm => {
        if (vm.cpuUtilization > maxEacoLoad) {
          maxEacoLoad = vm.cpuUtilization;
          maxEacoVmId = vm.vmId;
        }
      });

      setHighlightedVM({ EPSO: maxEpsoVmId, EACO: maxEacoVmId });

      // Set total tasks from backend data
      setTotalTasks(epsoResults.summary.totalCloudlets || 100);
    }
  }, [epsoResults, rrResults, dataCenterConfig.numVMs]);

  // Handle workload file for task count
  useEffect(() => {
    if (workloadFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim() !== '');
        setTotalTasks(lines.length - 1); // Exclude header
      };
      reader.readAsText(workloadFile);
    }
  }, [workloadFile]);

  const handlePlayPause = () => {
    if (isPlaying) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const startTime = Date.now();
      const duration = 10000; // 10 seconds for animation

      if (epsoResults && rrResults) {
        // Reset state
        const resetCounts = { EPSO: {}, EACO: {} };
        const resetLoads = { EPSO: {}, EACO: {} };
        const initialVMs = { EPSO: [], EACO: [] };
        for (let i = 0; i < dataCenterConfig.numVMs; i++) {
          resetCounts.EPSO[i] = 0;
          resetLoads.EPSO[i] = 0;
          resetCounts.EACO[i] = 0;
          resetLoads.EACO[i] = 0;
        }
        setTaskCounts(resetCounts);
        setCpuLoads(resetLoads);
        setActiveVMs({ EPSO: [], EACO: [] });
        setProgress(0);
        setHighlightedVM({ EPSO: null, EACO: null });

        // Get final state from backend
        const finalEpsoLoads = {};
        const finalEacoLoads = {};
        const finalEpsoCounts = {};
        const finalEacoCounts = {};
        const finalEpsoActive = [];
        const finalEacoActive = [];

        epsoResults.vmUtilization.forEach(vm => {
          const vmId = vm.vmId;
          finalEpsoLoads[vmId] = vm.cpuUtilization / 100 || 0;
          finalEpsoCounts[vmId] = vm.numAPECloudlets || 0;
          if (vm.cpuUtilization > 0) finalEpsoActive.push(vmId);
        });

        rrResults.vmUtilization.forEach(vm => {
          const vmId = vm.vmId;
          finalEacoLoads[vmId] = vm.cpuUtilization / 100 || 0;
          finalEacoCounts[vmId] = vm.numAPECloudlets || 0;
          if (vm.cpuUtilization > 0) finalEacoActive.push(vmId);
        });

        const animate = (timestamp) => {
          const elapsed = Date.now() - startTime;
          const newProgress = Math.min(100, (elapsed / duration) * 100);
          setProgress(newProgress);

          const currentEpsoLoads = {};
          const currentEacoLoads = {};
          const currentEpsoCounts = {};
          const currentEacoCounts = {};
          const currentEpsoActive = [];
          const currentEacoActive = [];

          // Interpolate based on progress
          for (let i = 0; i < dataCenterConfig.numVMs; i++) {
            const percentPerVM = 95 / Math.max(finalEpsoActive.length, finalEacoActive.length);
            const revealThreshold = finalEpsoActive.indexOf(i) * percentPerVM;

            // EPSO
            if (finalEpsoActive.includes(i) && newProgress >= revealThreshold) {
              currentEpsoActive.push(i);
              const vmVisibleProgress = Math.min(100, (newProgress - revealThreshold) * (100 / percentPerVM)) / 100;
              currentEpsoLoads[i] = finalEpsoLoads[i] * vmVisibleProgress;
              currentEpsoCounts[i] = Math.round(finalEpsoCounts[i] * vmVisibleProgress);
            } else {
              currentEpsoLoads[i] = 0;
              currentEpsoCounts[i] = 0;
            }

            // EACO
            if (finalEacoActive.includes(i) && newProgress >= revealThreshold) {
              currentEacoActive.push(i);
              const vmVisibleProgress = Math.min(100, (newProgress - revealThreshold) * (100 / percentPerVM)) / 100;
              currentEacoLoads[i] = finalEacoLoads[i] * vmVisibleProgress;
              currentEacoCounts[i] = Math.round(finalEacoCounts[i] * vmVisibleProgress);
            } else {
              currentEacoLoads[i] = 0;
              currentEacoCounts[i] = 0;
            }
          }

          // Log current state during animation
          if (newProgress % 10 === 0) { // Log every 10% progress
            console.group(`Animation Progress: ${newProgress}%`);
            console.log('Current State:');
            console.log('EPSO:', {
              activeVMs: currentEpsoActive.length,
              avgLoad: Object.values(currentEpsoLoads).reduce((sum, load) => sum + load, 0) / dataCenterConfig.numVMs,
              totalTasks: Object.values(currentEpsoCounts).reduce((sum, count) => sum + count, 0)
            });
            console.log('EACO:', {
              activeVMs: currentEacoActive.length,
              avgLoad: Object.values(currentEacoLoads).reduce((sum, load) => sum + load, 0) / dataCenterConfig.numVMs,
              totalTasks: Object.values(currentEacoCounts).reduce((sum, count) => sum + count, 0)
            });
            console.groupEnd();
          }

          // Highlight VMs with highest load
          let maxEpsoLoad = 0;
          let maxEpsoVmId = null;
          let maxEacoLoad = 0;
          let maxEacoVmId = null;

          for (let i = 0; i < dataCenterConfig.numVMs; i++) {
            if (currentEpsoLoads[i] > maxEpsoLoad) {
              maxEpsoLoad = currentEpsoLoads[i];
              maxEpsoVmId = i;
            }
            if (currentEacoLoads[i] > maxEacoLoad) {
              maxEacoLoad = currentEacoLoads[i];
              maxEacoVmId = i;
            }
          }

          setActiveVMs({ EPSO: currentEpsoActive, EACO: currentEacoActive });
          setTaskCounts({ EPSO: currentEpsoCounts, EACO: currentEacoCounts });
          setCpuLoads({ EPSO: currentEpsoLoads, EACO: currentEacoLoads });
          setHighlightedVM({ EPSO: maxEpsoVmId, EACO: maxEacoVmId });

          setMetrics({
            EPSO: newProgress >= 99 ? {
              imbalance: epsoResults.summary.imbalanceDegree.toFixed(2),
              makespan: epsoResults.summary.makespan.toFixed(2),
              utilization: (epsoResults.summary.resourceUtilization * 100).toFixed(2)
            } : {
              imbalance: (epsoResults.summary.imbalanceDegree * (newProgress / 100)).toFixed(2),
              makespan: (epsoResults.summary.makespan * (newProgress / 100)).toFixed(2),
              utilization: (epsoResults.summary.resourceUtilization * 100 * (newProgress / 100)).toFixed(2)
            },
            EACO: newProgress >= 99 ? {
              imbalance: rrResults.summary.imbalanceDegree.toFixed(2),
              makespan: rrResults.summary.makespan.toFixed(2),
              utilization: (rrResults.summary.resourceUtilization * 100).toFixed(2)
            } : {
              imbalance: (rrResults.summary.imbalanceDegree * (newProgress / 100)).toFixed(2),
              makespan: (rrResults.summary.makespan * (newProgress / 100)).toFixed(2),
              utilization: (rrResults.summary.resourceUtilization * 100 * (newProgress / 100)).toFixed(2) // Fixed: Use rrResults
            }
          });

          if (newProgress < 100) {
            animationRef.current = requestAnimationFrame(animate);
          } else {
            setIsPlaying(false);
            setShowResultsButton(true);
            setActiveVMs({ EPSO: finalEpsoActive, EACO: finalEacoActive });
            setTaskCounts({ EPSO: finalEpsoCounts, EACO: finalEacoCounts });
            setCpuLoads({ EPSO: finalEpsoLoads, EACO: finalEacoLoads });
            setMetrics({
              EPSO: {
                imbalance: epsoResults.summary.imbalanceDegree.toFixed(2),
                makespan: epsoResults.summary.makespan.toFixed(2),
                utilization: (epsoResults.summary.resourceUtilization * 100).toFixed(2)
              },
              EACO: {
                imbalance: rrResults.summary.imbalanceDegree.toFixed(2),
                makespan: rrResults.summary.makespan.toFixed(2),
                utilization: (rrResults.summary.resourceUtilization * 100).toFixed(2)
              }
            });
          }
        };

        animationRef.current = requestAnimationFrame(animate);
      }
    }
  };

  const handleReset = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    setIsPlaying(false);
    setProgress(0);

    const resetCounts = { EPSO: {}, EACO: {} };
    const resetLoads = { EPSO: {}, EACO: {} };
    const initialVMs = { EPSO: [], EACO: [] };
    for (let i = 0; i < dataCenterConfig.numVMs; i++) {
      resetCounts.EPSO[i] = 0;
      resetLoads.EPSO[i] = 0;
      resetCounts.EACO[i] = 0;
      resetLoads.EACO[i] = 0;
    }

    setTaskCounts(resetCounts);
    setCpuLoads(resetLoads);
    setActiveVMs(initialVMs);
    setHighlightedVM({ EPSO: null, EACO: null });
    setMetrics({
      EPSO: { imbalance: 0, makespan: 0, utilization: 0 },
      EACO: { imbalance: 0, makespan: 0, utilization: 0 }
    });
    setShowResultsButton(false);
  };

  const getVmStatus = (vmId, algorithm) => {
    const cpuLoad = cpuLoads[algorithm][vmId] || 0;
    const cpuPercentage = Math.min(100, cpuLoad * 100); // Convert to percentage

    if (cpuPercentage > 90) return 'Overloaded';
    if (cpuPercentage > 70) return 'High Load';
    if (cpuPercentage > 30) return 'Medium Load';
    if (cpuPercentage > 0) return 'Normal';
    return 'Idle';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Overloaded': return 'bg-red-100 text-red-800 border-red-300';
      case 'High Load': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Medium Load': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Normal': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const renderAlgorithmTabs = () => (
    <div className="flex mb-6 border-b border-gray-200">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-all ${activeAlgorithm === 'EPSO' 
          ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        onClick={() => setActiveAlgorithm('EPSO')}
      >
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Enhanced PSO
        </div>
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-all ${activeAlgorithm === 'EACO' 
          ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50' 
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        onClick={() => setActiveAlgorithm('EACO')}
      >
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0 Blaine4 4m-4-4l4-4" />
          </svg>
          Enhanced ACO
        </div>
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-all ${activeAlgorithm === 'comparison' 
          ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' 
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        onClick={() => setActiveAlgorithm('comparison')}
      >
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Comparison
        </div>
      </motion.button>
    </div>
  );

  const renderVMCards = (algorithm) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: dataCenterConfig.numVMs }).map((_, i) => (
        <motion.div
          key={`${algorithm}-${i}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            scale: highlightedVM[algorithm] === i ? 1.03 : 1,
            boxShadow: highlightedVM[algorithm] === i ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none'
          }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          whileHover={{ scale: 1.02 }}
        >
          <VMCard
            vmId={i}
            isActive={activeVMs[algorithm].includes(i)}
            isHighlighted={highlightedVM[algorithm] === i}
            taskCount={taskCounts[algorithm][i] || 0}
            cpuLoad={cpuLoads[algorithm][i] || 0}
            dataCenterConfig={dataCenterConfig}
            status={getVmStatus(i, algorithm)}
            getStatusColor={getStatusColor}
          />
        </motion.div>
      ))}
    </div>
  );

  const renderComparisonView = () => (
    <div className="mb-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-4"
      >
        <h4 className="text-xl font-bold text-gray-800">Algorithm Comparison</h4>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-sm border border-blue-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h5 className="font-bold text-lg text-blue-600 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Enhanced PSO
            </h5>
            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
              {activeVMs.EPSO.length} Active VMs
            </span>
          </div>
          <div className="h-[400px] overflow-y-auto smooth-scroll pr-2">
            {renderVMCards('EPSO')}
          </div>
          <MetricsPanel metrics={metrics.EPSO} color="blue" />
        </motion.div>
        
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-sm border border-purple-100"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h5 className="font-bold text-lg text-purple-600 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0 Blaine4 4m-4-4l4-4" />
              </svg>
              Enhanced ACO
            </h5>
            <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
              {activeVMs.EACO.length} Active VMs
            </span>
          </div>
          <div className="h-[400px] overflow-y-auto smooth-scroll pr-2">
            {renderVMCards('EACO')}
          </div>
          <MetricsPanel metrics={metrics.EACO} color="purple" />
        </motion.div>
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-grow p-6 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <motion.div 
        className="bg-white p-8 rounded-xl shadow-lg mb-6 border border-gray-200"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Task Assignment Visualization</h3>
            <div className="text-sm text-gray-600">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Showing assignment of {cloudletConfig.numCloudlets} tasks to {dataCenterConfig.numVMs} VMs
              </div>
              <div className="flex items-center mt-1 text-xs text-gray-500">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                VM Configuration: {dataCenterConfig.vmPes} PEs @ {dataCenterConfig.vmMips} MIPS each
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              {totalTasks} Total Tasks
            </div>
          </div>
        </div>

        {renderAlgorithmTabs()}
        
        {activeAlgorithm === 'comparison' ? (
          renderComparisonView()
        ) : (
          <>
            <div className="h-[500px] overflow-y-auto smooth-scroll mb-6 pr-2">
              {renderVMCards(activeAlgorithm)}
            </div>
            <MetricsPanel 
              metrics={metrics[activeAlgorithm]} 
              color={activeAlgorithm === 'EPSO' ? 'blue' : 'purple'} 
            />
          </>
        )}

        <Controls
          isPlaying={isPlaying}
          handlePlayPause={handlePlayPause}
          handleReset={handleReset}
          progress={progress}
          total={totalTasks}
          cloudlets={cloudletConfig.numCloudlets}
        />

        <AnimatePresence>
          {showResultsButton && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="mt-6 flex justify-end"
            >
              <motion.button
                onClick={onViewResults}
                className="bg-gradient-to-r from-[#319694] to-[#2a827f] text-white px-6 py-3 rounded-lg hover:shadow-md transition-all flex items-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Detailed Results
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default AnimationTab;