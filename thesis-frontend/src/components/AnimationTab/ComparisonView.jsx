import { motion } from "framer-motion";
import { useState } from "react";
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
  const [comparisonMode, setComparisonMode] = useState("enhanced"); // "enhanced" or "baseline"
  const [activeComparison, setActiveComparison] = useState("EPSOvsPSO"); // "EPSOvsPSO" or "EACOvsACO"

  const enhancedAlgorithms = [
    { id: "EPSO", label: "EPSO", color: "blue", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    { id: "EACO", label: "EACO", color: "purple", icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" }
  ];

  const baselineAlgorithms = [
    { id: "PSO", label: "PSO", color: "green", icon: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8" },
    { id: "ACO", label: "ACO", color: "orange", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" }
  ];

  const algorithms = comparisonMode === "enhanced" ? enhancedAlgorithms : baselineAlgorithms;

  return (
    <div className="mb-4 sm:mb-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-3"
      >
        <h4 className="text-lg sm:text-xl font-bold text-gray-800">
          Algorithm Comparison
        </h4>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 font-medium">Compare:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setComparisonMode("enhanced")}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                comparisonMode === "enhanced"
                  ? "bg-[#319694] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Enhanced
            </button>
            <button
              onClick={() => setComparisonMode("baseline")}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                comparisonMode === "baseline"
                  ? "bg-[#319694] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Baseline
            </button>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-3 sm:gap-6">
        {algorithms.map((algorithm) => (
          <AlgorithmComparisonPanel
            key={algorithm.id}
            algorithm={algorithm.id}
            color={algorithm.color}
            activeVMs={activeVMs}
            taskCounts={taskCounts}
            cpuLoads={cpuLoads}
            highlightedVM={highlightedVM}
            metrics={metrics[algorithm.id]}
            dataCenterConfig={dataCenterConfig}
            getVmStatus={getVmStatus}
            getStatusColor={getStatusColor}
          />
        ))}
      </div>

      {/* Toggleable Comparison Sections */}
      {(metrics.EPSO && metrics.PSO && metrics.EACO && metrics.ACO) && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-lg font-bold text-gray-800">Performance Comparison</h5>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 font-medium">View:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveComparison("EPSOvsPSO")}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                    activeComparison === "EPSOvsPSO"
                      ? "bg-blue-500 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  EPSO vs PSO
                </button>
                <button
                  onClick={() => setActiveComparison("EACOvsACO")}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                    activeComparison === "EACOvsACO"
                      ? "bg-purple-500 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  EACO vs ACO
                </button>
              </div>
            </div>
          </div>

          {activeComparison === "EPSOvsPSO" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CrossComparisonMetrics 
                enhancedMetrics={metrics.EPSO} 
                baselineMetrics={metrics.PSO}
                enhancedLabel="EPSO"
                baselineLabel="PSO"
                enhancedColor="blue"
              />
            </motion.div>
          )}
          
          {activeComparison === "EACOvsACO" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CrossComparisonMetrics 
                enhancedMetrics={metrics.EACO} 
                baselineMetrics={metrics.ACO}
                enhancedLabel="EACO"
                baselineLabel="ACO"
                enhancedColor="purple"
              />
            </motion.div>
          )}
        </div>
      )}
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
      description: "Enhanced Particle Swarm Optimization"
    },
    EACO: {
      icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4",
      label: "EACO",
      bgColor: "purple",
      description: "Enhanced Ant Colony Optimization"
    },
    PSO: {
      icon: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8",
      label: "PSO",
      bgColor: "green",
      description: "Particle Swarm Optimization"
    },
    ACO: {
      icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
      label: "ACO",
      bgColor: "orange",
      description: "Ant Colony Optimization"
    },
  };

  const config = algorithmConfig[algorithm];

  return (
    <motion.div
      className={`bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-${config.bgColor}-100`}
      initial={{ opacity: 0, x: algorithm === "EPSO" || algorithm === "PSO" ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex-1">
          <h5 className={`font-bold text-base sm:text-lg text-${config.bgColor}-600 flex items-center mb-1`}>
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
          <p className="text-xs text-gray-500 mb-2">{config.description}</p>
        </div>
        <span className={`text-xs sm:text-sm bg-${config.bgColor}-600 text-white px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0 ml-2`}>
          {activeVMs[algorithm]?.length || 0} Active VMs
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

const CrossComparisonMetrics = ({ enhancedMetrics, baselineMetrics, enhancedLabel, baselineLabel, enhancedColor }) => {
  const calculateImprovement = (enhanced, baseline, isLowerBetter = true) => {
    if (!enhanced || !baseline) return 0;
    const enhancedVal = parseFloat(enhanced);
    const baselineVal = parseFloat(baseline);
    
    if (baselineVal === 0) return 0;
    
    if (isLowerBetter) {
      return ((baselineVal - enhancedVal) / baselineVal) * 100;
    } else {
      return ((enhancedVal - baselineVal) / baselineVal) * 100;
    }
  };

  const improvements = {
    imbalance: calculateImprovement(enhancedMetrics.imbalance, baselineMetrics.imbalance, true),
    makespan: calculateImprovement(enhancedMetrics.makespan, baselineMetrics.makespan, true),
    utilization: calculateImprovement(enhancedMetrics.utilization, baselineMetrics.utilization, false),
    energyConsumption: calculateImprovement(enhancedMetrics.energyConsumption, baselineMetrics.energyConsumption, true),
    responseTime: calculateImprovement(enhancedMetrics.responseTime, baselineMetrics.responseTime, true),
  };

  const getColorClass = (improvement, isLowerBetter = true) => {
    if (improvement > 0) return 'text-green-600';
    if (improvement < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className={`p-4 bg-gradient-to-r from-${enhancedColor}-50 to-gray-50 rounded-xl border border-${enhancedColor}-200`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <MetricImprovement
          label="Load Imbalance"
          improvement={improvements.imbalance}
          isPositive={improvements.imbalance > 0}
          description="Lower is better"
          colorClass={getColorClass(improvements.imbalance, true)}
        />
        <MetricImprovement
          label="Makespan"
          improvement={improvements.makespan}
          isPositive={improvements.makespan > 0}
          description="Lower is better"
          colorClass={getColorClass(improvements.makespan, true)}
        />
        <MetricImprovement
          label="Resource Utilization"
          improvement={improvements.utilization}
          isPositive={improvements.utilization > 0}
          description="Higher is better"
          colorClass={getColorClass(improvements.utilization, false)}
        />
        <MetricImprovement
          label="Energy Consumption"
          improvement={improvements.energyConsumption}
          isPositive={improvements.energyConsumption > 0}
          description="Lower is better"
          colorClass={getColorClass(improvements.energyConsumption, true)}
        />
        <MetricImprovement
          label="Response Time"
          improvement={improvements.responseTime}
          isPositive={improvements.responseTime > 0}
          description="Lower is better"
          colorClass={getColorClass(improvements.responseTime, true)}
        />
      </div>
    </div>
  );
};

const MetricImprovement = ({ label, improvement, isPositive, description, colorClass }) => (
  <div className="text-center p-3 bg-white rounded-lg shadow-sm">
    <div className="text-sm font-medium text-gray-700 mb-1">{label}</div>
    <div className={`text-lg font-bold ${colorClass}`}>
      {isPositive ? '+' : ''}{improvement.toFixed(1)}%
    </div>
    <div className="text-xs text-gray-500 mt-1">{description}</div>
  </div>
);