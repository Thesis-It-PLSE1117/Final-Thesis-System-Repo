import { motion } from "framer-motion";
import MetricsPanel from "./MetricsPanel";
import { VMCardsGrid } from "./VMCardsGrid";

export const ComparisonView = ({
  activeVMs,
  taskCounts,
  cpuLoads,
  highlightedVM,
  metrics,
  dataCenterConfig,
  getVmStatus,
  getStatusColor,
}) => {
  return (
    <div className="mb-4 sm:mb-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-3 sm:mb-4"
      >
        <h4 className="text-lg sm:text-xl font-bold text-gray-800">
          Algorithm Comparison
        </h4>
      </motion.div>
      
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-3 sm:gap-6">
        <AlgorithmComparisonPanel
          algorithm="EPSO"
          color="blue"
          activeVMs={activeVMs}
          taskCounts={taskCounts}
          cpuLoads={cpuLoads}
          highlightedVM={highlightedVM}
          metrics={metrics.EPSO}
          dataCenterConfig={dataCenterConfig}
          getVmStatus={getVmStatus}
          getStatusColor={getStatusColor}
        />
        
        <AlgorithmComparisonPanel
          algorithm="EACO"
          color="purple"
          activeVMs={activeVMs}
          taskCounts={taskCounts}
          cpuLoads={cpuLoads}
          highlightedVM={highlightedVM}
          metrics={metrics.EACO}
          dataCenterConfig={dataCenterConfig}
          getVmStatus={getVmStatus}
          getStatusColor={getStatusColor}
        />
      </div>
    </div>
  );
};

const AlgorithmComparisonPanel = ({
  algorithm,
  color,
  activeVMs,
  taskCounts,
  cpuLoads,
  highlightedVM,
  metrics,
  dataCenterConfig,
  getVmStatus,
  getStatusColor,
}) => {
  const algorithmConfig = {
    EPSO: {
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      label: "EPSO",
      bgColor: "blue",
    },
    EACO: {
      icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4",
      label: "EACO",
      bgColor: "purple",
    },
  };

  const config = algorithmConfig[algorithm];

  return (
    <motion.div
      className={`bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-${config.bgColor}-100`}
      initial={{ opacity: 0, x: algorithm === "EPSO" ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h5 className={`font-bold text-base sm:text-lg text-${config.bgColor}-600 flex items-center`}>
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={config.icon} />
          </svg>
          <span>{config.label}</span>
        </h5>
        <span className={`text-xs sm:text-sm bg-${config.bgColor}-600 text-white px-2 py-1 rounded-full whitespace-nowrap`}>
          {activeVMs[algorithm].length} Active VMs
        </span>
      </div>
      
      <div className="h-[300px] sm:h-[400px] overflow-y-auto smooth-scroll pr-1 sm:pr-2 mb-3 sm:mb-4">
        <VMCardsGrid
          algorithm={algorithm}
          dataCenterConfig={dataCenterConfig}
          activeVMs={activeVMs}
          taskCounts={taskCounts}
          cpuLoads={cpuLoads}
          highlightedVM={highlightedVM}
          getVmStatus={getVmStatus}
          getStatusColor={getStatusColor}
          isCompactView={true}
        />
      </div>
      
      <MetricsPanel metrics={metrics} color={config.bgColor} />
    </motion.div>
  );
};