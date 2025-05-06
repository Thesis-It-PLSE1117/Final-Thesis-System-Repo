import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MetricsPanel from '../subcomponents/AnimationTab/MetricsPanel';
import Controls from '../subcomponents/AnimationTab/Controls';
import AlgorithmTabs from '../subcomponents/AnimationTab/AlgorithmTabs';
import AlgorithmView from '../subcomponents/AnimationTab/AlgorithmView';
import { assignTasksWithEPSO, assignTasksWithEACO } from '../subcomponents/AnimationTab/TaskAssignmentAlgorithms';

const AnimationTab = ({ dataCenterConfig, cloudletConfig, workloadFile, onBack, onViewResults }) => {
  const [activeAlgorithm, setActiveAlgorithm] = useState('EPSO');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeVMs, setActiveVMs] = useState({ EPSO: [], EACO: [] });
  const [taskCounts, setTaskCounts] = useState({ EPSO: {}, EACO: {} });
  const [cpuLoads, setCpuLoads] = useState({ EPSO: {}, EACO: {} });
  const [totalTasks, setTotalTasks] = useState(0);
  const [executionTime, setExecutionTime] = useState({ EPSO: 0, EACO: 0 });
  const [metrics, setMetrics] = useState({
    EPSO: { imbalance: 0, makespan: 0, utilization: 0 },
    EACO: { imbalance: 0, makespan: 0, utilization: 0 }
  });
  const [highlightedVM, setHighlightedVM] = useState({ EPSO: null, EACO: null });

  const animationRef = useRef(null);
  const tasksRef = useRef([]);
  const lastUpdateTimeRef = useRef(0);
  const frameCountRef = useRef(0);

  const algorithms = {
    EPSO: {
      id: 'EPSO',
      label: 'Enhanced PSO',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      color: 'blue',
      rgb: '59, 130, 246',
      initialX: -20
    },
    EACO: {
      id: 'EACO',
      label: 'Enhanced ACO',
      icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
      color: 'purple',
      rgb: '124, 58, 237',
      initialX: 20
    }
  };

  const calculateMetrics = useCallback((loads) => {
    const loadValues = Object.values(loads);
    if (loadValues.length === 0) return { imbalance: 0, makespan: 0, utilization: 0 };

    const maxLoad = Math.max(...loadValues);
    const avgLoad = loadValues.reduce((sum, load) => sum + load, 0) / loadValues.length;
    const variance = loadValues.reduce((sum, load) => sum + Math.pow(load - avgLoad, 2), 0) / loadValues.length;
    const stdDev = Math.sqrt(variance);
    const utilization = maxLoad > 0 ? (avgLoad / maxLoad) * 100 : 0;

    return {
      imbalance: stdDev.toFixed(2),
      makespan: maxLoad.toFixed(2),
      utilization: utilization.toFixed(2)
    };
  }, []);

  const getVmStatus = useCallback((vmId, algorithm) => {
    const cpuLoad = cpuLoads[algorithm][vmId] || 0;
    const vmPes = dataCenterConfig.vmPes || 1;
    const cpuPercentage = Math.min(100, (cpuLoad / vmPes) * 100);

    if (cpuPercentage > 90) return 'Overloaded';
    if (cpuPercentage > 70) return 'High Load';
    if (cpuPercentage > 0) return 'Normal';
    return 'Idle';
  }, [cpuLoads, dataCenterConfig.vmPes]);

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'Overloaded': return 'bg-red-100 text-red-800 border-red-300';
      case 'High Load': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Normal': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  }, []);

  useEffect(() => {
    if (!workloadFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n').filter(line => line.trim() !== '');
      if (lines.length === 0) return;

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

      const initialState = {};
      for (const algo of ['EPSO', 'EACO']) {
        initialState[algo] = {};
        for (let i = 0; i < dataCenterConfig.numVMs; i++) {
          initialState[algo][i] = 0;
        }
      }

      setTaskCounts({ ...initialState });
      setCpuLoads({ ...initialState });
    };
    reader.readAsText(workloadFile);
  }, [workloadFile, dataCenterConfig.numVMs]);

  const processTasks = useCallback((tasksSlice) => {
    const startEPSTime = performance.now();
    const epsonAssignments = assignTasksWithEPSO(
      tasksSlice, 
      dataCenterConfig.numVMs, 
      dataCenterConfig.vmPes * dataCenterConfig.vmMips
    );
    const endEPSTime = performance.now();

    const startEACOTime = performance.now();
    const eacoAssignments = assignTasksWithEACO(
      tasksSlice, 
      dataCenterConfig.numVMs,
      dataCenterConfig.vmPes * dataCenterConfig.vmMips
    );
    const endEACOTime = performance.now();

    setExecutionTime({
      EPSO: endEPSTime - startEPSTime,
      EACO: endEACOTime - startEACOTime
    });

    return { epsonAssignments, eacoAssignments };
  }, [dataCenterConfig]);

  const updateVMStates = useCallback((epsonAssignments, eacoAssignments) => {
    const counts = { EPSO: {}, EACO: {} };
    const loads = { EPSO: {}, EACO: {} };
    const active = { EPSO: [], EACO: [] };
    const newHighlighted = { EPSO: null, EACO: null };
    let maxEPVOLoad = 0;
    let maxEACOLoad = 0;

    for (let i = 0; i < dataCenterConfig.numVMs; i++) {
      counts.EPSO[i] = 0;
      loads.EPSO[i] = 0;
      counts.EACO[i] = 0;
      loads.EACO[i] = 0;
    }

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

    for (const vmId in eacoAssignments) {
      if (eacoAssignments[vmId].length > 0) {
        const id = parseInt(vmId);
        active.EACO.push(id);
        counts.EACO[id] = eacoAssignments[vmId].length;
        loads.EACO[id] = eacoAssignments[vmId].reduce(
          (sum, task) => sum + (parseFloat(task.cpu_request) || 0), 0);
        
        if (loads.EACO[id] > maxEACOLoad) {
          maxEACOLoad = loads.EACO[id];
          newHighlighted.EACO = id;
        }
      }
    }

    setActiveVMs(active);
    setTaskCounts(counts);
    setCpuLoads(loads);
    setHighlightedVM(newHighlighted);
    setMetrics({
      EPSO: calculateMetrics(loads.EPSO),
      EACO: calculateMetrics(loads.EACO)
    });
  }, [dataCenterConfig.numVMs, calculateMetrics]);

  const animate = useCallback((startTime, duration) => (timestamp) => {
    const elapsed = Date.now() - startTime;
    const newProgress = Math.min(100, (elapsed / duration) * 100);
    setProgress(newProgress);

    frameCountRef.current += 1;
    if (frameCountRef.current % 2 === 0 || lastUpdateTimeRef.current === 0) {
      lastUpdateTimeRef.current = timestamp;
      
      const tasksToShow = Math.floor(cloudletConfig.numCloudlets * newProgress / 100);
      const tasksSlice = tasksRef.current.slice(0, tasksToShow);
      
      const { epsonAssignments, eacoAssignments } = processTasks(tasksSlice);
      updateVMStates(epsonAssignments, eacoAssignments);
    }

    if (newProgress < 100) {
      animationRef.current = requestAnimationFrame(animate(startTime, duration));
    } else {
      setIsPlaying(false);
    }
  }, [cloudletConfig.numCloudlets, processTasks, updateVMStates]);

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      cancelAnimationFrame(animationRef.current);
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    frameCountRef.current = 0;
    lastUpdateTimeRef.current = 0;

    const resetState = {};
    for (const algo of ['EPSO', 'EACO']) {
      resetState[algo] = {};
      for (let i = 0; i < dataCenterConfig.numVMs; i++) {
        resetState[algo][i] = 0;
      }
    }

    setTaskCounts({ ...resetState });
    setCpuLoads({ ...resetState });
    setActiveVMs({ EPSO: [], EACO: [] });
    setExecutionTime({ EPSO: 0, EACO: 0 });
    setMetrics({
      EPSO: { imbalance: 0, makespan: 0, utilization: 0 },
      EACO: { imbalance: 0, makespan: 0, utilization: 0 }
    });
    setHighlightedVM({ EPSO: null, EACO: null });

    const startTime = Date.now();
    const duration = 10000;
    animationRef.current = requestAnimationFrame(animate(startTime, duration));
  }, [isPlaying, dataCenterConfig.numVMs, animate]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    cancelAnimationFrame(animationRef.current);
    setProgress(0);
    
    const resetState = {};
    for (const algo of ['EPSO', 'EACO']) {
      resetState[algo] = {};
      for (let i = 0; i < dataCenterConfig.numVMs; i++) {
        resetState[algo][i] = 0;
      }
    }

    setTaskCounts({ ...resetState });
    setCpuLoads({ ...resetState });
    setActiveVMs({ EPSO: [], EACO: [] });
    setExecutionTime({ EPSO: 0, EACO: 0 });
    setMetrics({
      EPSO: { imbalance: 0, makespan: 0, utilization: 0 },
      EACO: { imbalance: 0, makespan: 0, utilization: 0 }
    });
    setHighlightedVM({ EPSO: null, EACO: null });
  }, [dataCenterConfig.numVMs]);

  const renderComparisonView = useCallback(() => (
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
            EACO: {executionTime.EACO.toFixed(2)}ms
          </span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <AlgorithmView 
          algorithm={algorithms.EPSO}
          activeVMs={activeVMs}
          taskCounts={taskCounts}
          cpuLoads={cpuLoads}
          dataCenterConfig={dataCenterConfig}
          metrics={metrics}
          executionTime={executionTime}
          highlightedVM={highlightedVM}
          getVmStatus={getVmStatus}
          getStatusColor={getStatusColor}
        />
        <AlgorithmView 
          algorithm={algorithms.EACO}
          activeVMs={activeVMs}
          taskCounts={taskCounts}
          cpuLoads={cpuLoads}
          dataCenterConfig={dataCenterConfig}
          metrics={metrics}
          executionTime={executionTime}
          highlightedVM={highlightedVM}
          getVmStatus={getVmStatus}
          getStatusColor={getStatusColor}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <MetricsPanel 
          metrics={metrics.EPSO} 
          color="blue"
          title="EPSO Metrics"
        />
        <MetricsPanel 
          metrics={metrics.EACO} 
          color="purple"
          title="EACO Metrics"
        />
      </div>
    </div>
  ), [activeVMs, taskCounts, cpuLoads, dataCenterConfig, metrics, executionTime, highlightedVM, getVmStatus, getStatusColor, algorithms]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-grow p-6 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <motion.div 
        className="bg-white p-8 rounded-xl shadow-lg mb-6 border border-green-200"
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

        <AlgorithmTabs 
          activeAlgorithm={activeAlgorithm} 
          setActiveAlgorithm={setActiveAlgorithm} 
        />
        
        {activeAlgorithm === 'comparison' ? (
          renderComparisonView()
        ) : (
          <>
            <div className="h-[500px] overflow-y-auto smooth-scroll mb-4 pr-2">
              <AlgorithmView 
                algorithm={algorithms[activeAlgorithm]}
                activeVMs={activeVMs}
                taskCounts={taskCounts}
                cpuLoads={cpuLoads}
                dataCenterConfig={dataCenterConfig}
                metrics={metrics}
                executionTime={executionTime}
                highlightedVM={highlightedVM}
                getVmStatus={getVmStatus}
                getStatusColor={getStatusColor}
              />
            </div>
            <MetricsPanel 
              metrics={metrics[activeAlgorithm]} 
              color={algorithms[activeAlgorithm].color}
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

        <motion.div
          className="mt-6 flex justify-end"
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
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
      </motion.div>
    </motion.div>
  );
};

export default AnimationTab;