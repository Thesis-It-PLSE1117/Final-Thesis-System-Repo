import { useEffect, useRef, useState } from 'react';
import VMCard from '../subcomponents/AnimationTab/VMCard';
import MetricsPanel from '../subcomponents/AnimationTab/MetricsPanel';
import Controls from '../subcomponents/AnimationTab/Controls';
import { assignTasksWithEPSO, assignTasksWithRoundRobin } from '../subcomponents/AnimationTab/EPSORRAlgorithm';
import { motion, AnimatePresence } from 'framer-motion';

const AnimationTab = ({ dataCenterConfig, cloudletConfig, workloadFile, onBack, onViewResults }) => {
  const [activeAlgorithm, setActiveAlgorithm] = useState('EPSO');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeVMs, setActiveVMs] = useState({ EPSO: [], RR: [] });
  const [taskCounts, setTaskCounts] = useState({ EPSO: {}, RR: {} });
  const [cpuLoads, setCpuLoads] = useState({ EPSO: {}, RR: {} });
  const [totalTasks, setTotalTasks] = useState(0);
  const animationRef = useRef(null);
  const tasksRef = useRef([]);
  const vmAssignmentsRef = useRef({ EPSO: {}, RR: {} });
  const [executionTime, setExecutionTime] = useState({ EPSO: 0, RR: 0 });
  const lastUpdateTimeRef = useRef(0);
  const [metrics, setMetrics] = useState({
    EPSO: { imbalance: 0, makespan: 0, utilization: 0 },
    RR: { imbalance: 0, makespan: 0, utilization: 0 }
  });
  const [showResultsButton, setShowResultsButton] = useState(true);
  const [highlightedVM, setHighlightedVM] = useState({ EPSO: null, RR: null });

  useEffect(() => {
    if (workloadFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const headers = lines[0].split(',');
        const data = lines.slice(1).map(line => {
          const values = line.split(',');
          return headers.reduce((obj, header, i) => {
            obj[header.trim()] = values[i] ? values[i].trim() : '';
            return obj;
          }, {});
        }).filter(task => task.job_id && task.task_index);

        tasksRef.current = data;
        setTotalTasks(data.length);

        const counts = { EPSO: {}, RR: {} };
        const loads = { EPSO: {}, RR: {} };
        for (let i = 0; i < dataCenterConfig.numVMs; i++) {
          counts.EPSO[i] = 0;
          loads.EPSO[i] = 0;
          counts.RR[i] = 0;
          loads.RR[i] = 0;
        }
        setTaskCounts(counts);
        setCpuLoads(loads);
      };
      reader.readAsText(workloadFile);
    }
  }, [workloadFile, dataCenterConfig.numVMs]);

  const calculateMetrics = (loads) => {
    const vmCount = dataCenterConfig.numVMs;
    if (vmCount === 0) return { imbalance: 0, makespan: 0, utilization: 0 };

    const loadValues = Object.values(loads);
    const maxLoad = Math.max(...loadValues);
    const avgLoad = loadValues.reduce((sum, load) => sum + load, 0) / vmCount;

    const squaredDiffs = loadValues.map(load => Math.pow(load - avgLoad, 2));
    const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / vmCount;
    const stdDev = Math.sqrt(variance);

    const utilization = (avgLoad / maxLoad) * 100;

    return {
      imbalance: stdDev.toFixed(2),
      makespan: maxLoad.toFixed(2),
      utilization: utilization.toFixed(2)
    };
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const startTime = Date.now();
      const duration = 10000;
      lastUpdateTimeRef.current = 0;

      const resetCounts = { EPSO: {}, RR: {} };
      const resetLoads = { EPSO: {}, RR: {} };
      for (let i = 0; i < dataCenterConfig.numVMs; i++) {
        resetCounts.EPSO[i] = 0;
        resetLoads.EPSO[i] = 0;
        resetCounts.RR[i] = 0;
        resetLoads.RR[i] = 0;
      }

      setTaskCounts(resetCounts);
      setCpuLoads(resetLoads);
      setActiveVMs({ EPSO: [], RR: [] });
      setExecutionTime({ EPSO: 0, RR: 0 });
      setMetrics({
        EPSO: { imbalance: 0, makespan: 0, utilization: 0 },
        RR: { imbalance: 0, makespan: 0, utilization: 0 }
      });
      setShowResultsButton(false);
      setHighlightedVM({ EPSO: null, RR: null });

      const animate = (timestamp) => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min(100, (elapsed / duration) * 100);
        setProgress(newProgress);

        if (timestamp - lastUpdateTimeRef.current >= 16 || lastUpdateTimeRef.current === 0) {
          lastUpdateTimeRef.current = timestamp;

          const tasksToShow = Math.floor(cloudletConfig.numCloudlets * newProgress / 100);
          const counts = { EPSO: {}, RR: {} };
          const loads = { EPSO: {}, RR: {} };
          const active = { EPSO: [], RR: [] };
          const newHighlighted = { EPSO: null, RR: null };

          for (let i = 0; i < dataCenterConfig.numVMs; i++) {
            counts.EPSO[i] = 0;
            loads.EPSO[i] = 0;
            counts.RR[i] = 0;
            loads.RR[i] = 0;
          }

          const tasksSlice = tasksRef.current.slice(0, tasksToShow);

          const startEPSTime = performance.now();
          const epsonAssignments = assignTasksWithEPSO(
            tasksSlice, 
            dataCenterConfig.numVMs, 
            dataCenterConfig.vmPes * dataCenterConfig.vmMips
          );
          const endEPSTime = performance.now();

          const startRRTime = performance.now();
          const rrAssignments = assignTasksWithRoundRobin(
            tasksSlice, 
            dataCenterConfig.numVMs
          );
          const endRRTime = performance.now();

          setExecutionTime({
            EPSO: endEPSTime - startEPSTime,
            RR: endRRTime - startRRTime
          });

          let maxEPVOLoad = 0;
          let maxRRLoad = 0;

          for (const vmId in epsonAssignments) {
            if (epsonAssignments[vmId].length > 0) {
              const id = parseInt(vmId);
              active.EPSO.push(id);
              counts.EPSO[id] = epsonAssignments[vmId].length;
              loads.EPSO[id] = epsonAssignments[vmId].reduce(
                (sum, task) => sum + (parseFloat(task.cpu_request) || 0), 0);
              
              if (loads.EPSO[id] > maxEPVOLoad) {
                maxEPVOLoad = loads.EPSO[id];
                newHighlighted.EPSO = id;
              }
            }
          }

          for (const vmId in rrAssignments) {
            if (rrAssignments[vmId].length > 0) {
              const id = parseInt(vmId);
              active.RR.push(id);
              counts.RR[id] = rrAssignments[vmId].length;
              loads.RR[id] = rrAssignments[vmId].reduce(
                (sum, task) => sum + (parseFloat(task.cpu_request) || 0), 0);
              
              if (loads.RR[id] > maxRRLoad) {
                maxRRLoad = loads.RR[id];
                newHighlighted.RR = id;
              }
            }
          }

          setActiveVMs(active);
          setTaskCounts(counts);
          setCpuLoads(loads);
          setHighlightedVM(newHighlighted);
          vmAssignmentsRef.current = { EPSO: epsonAssignments, RR: rrAssignments };

          setMetrics({
            EPSO: calculateMetrics(loads.EPSO),
            RR: calculateMetrics(loads.RR)
          });
        }

        if (newProgress < 100) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setIsPlaying(false);
          setShowResultsButton(true);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
    setActiveVMs({ EPSO: [], RR: [] });
    const counts = { EPSO: {}, RR: {} };
    const loads = { EPSO: {}, RR: {} };
    for (let i = 0; i < dataCenterConfig.numVMs; i++) {
      counts.EPSO[i] = 0;
      loads.EPSO[i] = 0;
      counts.RR[i] = 0;
      loads.RR[i] = 0;
    }
    setTaskCounts(counts);
    setCpuLoads(loads);
    setExecutionTime({ EPSO: 0, RR: 0 });
    setMetrics({
      EPSO: { imbalance: 0, makespan: 0, utilization: 0 },
      RR: { imbalance: 0, makespan: 0, utilization: 0 }
    });
    setShowResultsButton(false);
    setHighlightedVM({ EPSO: null, RR: null });
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  const getVmStatus = (vmId, algorithm) => {
    const cpuLoad = cpuLoads[algorithm][vmId] || 0;
    const vmPes = dataCenterConfig.vmPes || 1;
    const cpuPercentage = Math.min(100, (cpuLoad / vmPes) * 100);

    if (cpuPercentage > 90) return 'Overloaded';
    if (cpuPercentage > 70) return 'High Load';
    if (cpuPercentage > 0) return 'Normal';
    return 'Idle';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Overloaded': return 'bg-red-100 text-red-800 border-red-300';
      case 'High Load': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
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
        className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-all ${activeAlgorithm === 'RR' 
          ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50' 
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        onClick={() => setActiveAlgorithm('RR')}
      >
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Round Robin
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
            boxShadow: highlightedVM[algorithm] === i ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : 'none'
          }}
          transition={{ 
            duration: 0.3, 
            delay: i * 0.05,
            scale: { type: 'spring', stiffness: 300, damping: 20 }
          }}
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
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            EPSO: {executionTime.EPSO.toFixed(2)}ms
          </span>
          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
            RR: {executionTime.RR.toFixed(2)}ms
          </span>
        </div>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-sm border border-blue-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.1), 0 4px 6px -2px rgba(59, 130, 246, 0.05)' }}
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
          whileHover={{ boxShadow: '0 10px 15px -3px rgba(124, 58, 237, 0.1), 0 4px 6px -2px rgba(124, 58, 237, 0.05)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h5 className="font-bold text-lg text-purple-600 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Round Robin
            </h5>
            <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
              {activeVMs.RR.length} Active VMs
            </span>
          </div>
          <div className="h-[400px] overflow-y-auto smooth-scroll pr-2">
            {renderVMCards('RR')}
          </div>
          <MetricsPanel metrics={metrics.RR} color="purple" />
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