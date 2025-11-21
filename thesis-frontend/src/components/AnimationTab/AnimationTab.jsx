import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";
import MetricsPanel from "./MetricsPanel";
import Controls from "./Controls";
import { useAnimationState } from "../../hooks/useAnimationState";
import { useMetrics } from "../../hooks/useMetrics";
import { useVMStatus } from "../../hooks/useVMStatus";
import { useAnimationEngine } from "../../hooks/useAnimationEngine";
import { useVMStatusDistribution } from "../../hooks/useVMStatusDistribution";
import { AlgorithmTabs } from "./AlgorithmTabs";
import { IterationNotice } from "./IterationNotice";
import { ComparisonView } from "./ComparisonView";
import { VMCardsGrid } from "./VMCardsGrid";
import VMStatusTooltip from "./VMStatusTooltip";

const AnimationTab = ({
  dataCenterConfig,
  cloudletConfig,
  workloadFile,
  onBack,
  onViewResults,
  eacoResults,
  epsoResults,
  acoResults,
  psoResults,
}) => {
  const [activeAlgorithm, setActiveAlgorithm] = useState("EPSO");
  const [showResultsButton, setShowResultsButton] = useState(true);

  const animationState = useAnimationState(dataCenterConfig);
  const metricsState = useMetrics(epsoResults, eacoResults, acoResults, psoResults);
  const vmStatus = useVMStatus(animationState.activeVMs, animationState.taskCounts, animationState.cpuLoads);

  const isIterationResult = checkIfIterationResult(epsoResults, eacoResults, acoResults, psoResults);

  useWorkloadFile(workloadFile, metricsState.setTotalTasks);

  const animationEngine = useAnimationEngine({
    dataCenterConfig,
    epsoResults,
    eacoResults,
    acoResults,
    psoResults,
    animationState,
    metricsState,
    setShowResultsButton,
  });

  if (isIterationResult) {
    return <IterationNotice onViewResults={onViewResults} onBack={onBack} />;
  }

  return (
    <AnimationTabLayout
      dataCenterConfig={dataCenterConfig}
      cloudletConfig={cloudletConfig}
      activeAlgorithm={activeAlgorithm}
      animationState={animationState}
      metricsState={metricsState}
      vmStatus={vmStatus}
      showResultsButton={showResultsButton}
      onViewResults={onViewResults}
      onAlgorithmChange={setActiveAlgorithm}
      onPlayPause={animationEngine.handlePlayPause}
      onReset={animationState.resetAnimationState}
    />
  );
};

// Helper Components
const AnimationTabLayout = ({
  dataCenterConfig,
  cloudletConfig,
  activeAlgorithm,
  animationState,
  metricsState,
  vmStatus,
  showResultsButton,
  onViewResults,
  onAlgorithmChange,
  onPlayPause,
  onReset,
}) => {
  const [showStatusTooltip, setShowStatusTooltip] = useState(false);

  const statusDistribution = useVMStatusDistribution(
    animationState.activeVMs[activeAlgorithm] || [],
    animationState.taskCounts[activeAlgorithm] || {},
    animationState.cpuLoads[activeAlgorithm] || {},
    vmStatus.getVmStatus,
    activeAlgorithm
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-grow p-3 sm:p-6 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <motion.div
        className="bg-white p-4 sm:p-8 rounded-xl shadow-lg mb-4 sm:mb-6 border border-gray-200"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <HeaderSection dataCenterConfig={dataCenterConfig} cloudletConfig={cloudletConfig} />
        
        <div className="flex items-start justify-between gap-2 mb-4 sm:mb-6">
          <div className="flex-1">
            <AlgorithmTabs activeAlgorithm={activeAlgorithm} setActiveAlgorithm={onAlgorithmChange} />
          </div>
          
          {activeAlgorithm !== "comparison" && (
            <div className="relative pt-2">
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-[#319694] transition-colors cursor-help rounded-lg hover:bg-gray-50"
                onMouseEnter={() => setShowStatusTooltip(true)}
                onMouseLeave={() => setShowStatusTooltip(false)}
                onClick={() => setShowStatusTooltip(!showStatusTooltip)}
                aria-label="View VM status distribution"
              >
                <Info size={20} />
              </button>
              
              <AnimatePresence>
                {showStatusTooltip && (
                  <VMStatusTooltip
                    distribution={statusDistribution}
                    algorithm={activeAlgorithm}
                  />
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {activeAlgorithm === "comparison" ? (
          <ComparisonView
            activeVMs={animationState.activeVMs}
            taskCounts={animationState.taskCounts}
            cpuLoads={animationState.cpuLoads}
            metrics={metricsState.metrics}
            dataCenterConfig={dataCenterConfig}
            getVmStatus={vmStatus.getVmStatus}
            getStatusColor={vmStatus.getStatusColor}
          />
        ) : (
          <SingleAlgorithmView
            algorithm={activeAlgorithm}
            activeVMs={animationState.activeVMs}
            taskCounts={animationState.taskCounts}
            cpuLoads={animationState.cpuLoads}
            metrics={metricsState.metrics}
            dataCenterConfig={dataCenterConfig}
            getVmStatus={vmStatus.getVmStatus}
            getStatusColor={vmStatus.getStatusColor}
          />
        )}

        <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <Controls
            isPlaying={animationState.isPlaying}
            handlePlayPause={onPlayPause}
            handleReset={onReset}
            progress={animationState.progress}
            total={metricsState.totalTasks}
            cloudlets={cloudletConfig.numCloudlets}
          />

          {showResultsButton && <ResultsButton onViewResults={onViewResults} />}
        </div>
      </motion.div>
    </motion.div>
  );
};

const HeaderSection = ({ dataCenterConfig, cloudletConfig }) => (
  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
    <div className="flex-1">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Task Assignment View</h3>
      <div className="text-sm sm:text-sm text-gray-600 space-y-1">
        <div className="flex items-center">
          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="break-words">{cloudletConfig.numCloudlets} tasks → {dataCenterConfig.numVMs} VMs</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="break-words">VM: {dataCenterConfig.vmPes} PEs @ {dataCenterConfig.vmMips} MIPS</span>
        </div>
      </div>
    </div>
  </div>
);

const SingleAlgorithmView = ({
  algorithm,
  activeVMs,
  taskCounts,
  cpuLoads,
  metrics,
  dataCenterConfig,
  getVmStatus,
  getStatusColor,
}) => {
  // Color mapping for different algorithms
  const colorMap = {
    EPSO: "blue",
    EACO: "purple",
    PSO: "green", 
    ACO: "orange"
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="h-[400px] sm:h-[500px] overflow-y-auto smooth-scroll pr-1 sm:pr-2">
        <VMCardsGrid
          algorithm={algorithm}
          dataCenterConfig={dataCenterConfig}
          activeVMs={activeVMs}
          taskCounts={taskCounts}
          cpuLoads={cpuLoads}
          getVmStatus={getVmStatus}
          getStatusColor={getStatusColor}
        />
      </div>
      
      <div>
        <MetricsPanel
          metrics={metrics[algorithm] || getDefaultMetrics()}
          color={colorMap[algorithm] || "blue"}
        />
      </div>
    </div>
  );
};

const ResultsButton = ({ onViewResults }) => (
  <div className="flex justify-end">
    <motion.button
      onClick={onViewResults}
      className="bg-gradient-to-r from-[#319694] to-[#2a827f] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:shadow-md transition-all flex items-center justify-center text-sm sm:text-base w-full sm:w-auto"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      <span>View Detailed Results</span>
    </motion.button>
  </div>
);

// Helper functions
const checkIfIterationResult = (epsoResults, eacoResults, acoResults, psoResults) => {
  return (
    (epsoResults && epsoResults.isIterationResult) ||
    (eacoResults && eacoResults.isIterationResult) ||
    (acoResults && acoResults.isIterationResult) ||
    (psoResults && psoResults.isIterationResult) ||
    epsoResults?.rawResults?.totalIterations > 1 ||
    eacoResults?.rawResults?.totalIterations > 1 ||
    acoResults?.rawResults?.totalIterations > 1 ||
    psoResults?.rawResults?.totalIterations > 1
  );
};

const useWorkloadFile = (workloadFile, setTotalTasks) => {
  useEffect(() => {
    if (workloadFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const lines = text.split("\n").filter((line) => line.trim() !== "");
        setTotalTasks(lines.length - 1);
      };
      reader.readAsText(workloadFile);
    }
  }, [workloadFile, setTotalTasks]);
};

const getDefaultMetrics = () => ({
  imbalance: "0.0000",
  makespan: "0.00",
  utilization: "0.00",
  energyConsumption: "0.00",
  responseTime: "0.00"
});

export default AnimationTab;