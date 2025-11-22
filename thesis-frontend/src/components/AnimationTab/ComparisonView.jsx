import { motion } from "framer-motion";
import { useState } from "react";
import { Bird, Route, Sparkles, ChevronDown } from "lucide-react";

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
  const [leftAlgorithm, setLeftAlgorithm] = useState("EPSO");
  const [rightAlgorithm, setRightAlgorithm] = useState("PSO");
  const [dropdownOpen, setDropdownOpen] = useState({ left: false, right: false });

  const algorithms = [
    { 
      id: "EPSO", 
      label: "EPSO", 
      color: "blue", 
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      description: "Enhanced Particle Swarm Optimization",
      enhanced: true
    },
    { 
      id: "EACO", 
      label: "EACO", 
      color: "purple", 
      icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4",
      description: "Enhanced Ant Colony Optimization",
      enhanced: true
    },
    { 
      id: "PSO", 
      label: "PSO", 
      color: "green", 
      icon: "",
      description: "Particle Swarm Optimization",
      enhanced: false
    },
    { 
      id: "ACO", 
      label: "ACO", 
      color: "orange", 
      icon: "",
      description: "Ant Colony Optimization",
      enhanced: false
    }
  ];

  const leftAlgoConfig = algorithms.find(algo => algo.id === leftAlgorithm);
  const rightAlgoConfig = algorithms.find(algo => algo.id === rightAlgorithm);

  const availableLeftAlgorithms = algorithms.filter(algo => algo.id !== rightAlgorithm);
  const availableRightAlgorithms = algorithms.filter(algo => algo.id !== leftAlgorithm);

  const toggleDropdown = (side) => {
    setDropdownOpen(prev => ({
      ...prev,
      [side]: !prev[side]
    }));
  };

  const selectAlgorithm = (side, algorithmId) => {
    if (side === 'left') {
      setLeftAlgorithm(algorithmId);
      setDropdownOpen({ left: false, right: false });
    } else {
      setRightAlgorithm(algorithmId);
      setDropdownOpen({ left: false, right: false });
    }
  };

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
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 font-medium">Compare:</span>
            
            {/* Left Algorithm Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('left')}
                className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors min-w-[120px] justify-between"
              >
                <span className="flex items-center space-x-2">
                  {leftAlgoConfig.enhanced ? (
                    <Sparkles className="w-4 h-4" />
                  ) : leftAlgoConfig.id === "PSO" ? (
                    <Bird className="w-4 h-4" />
                  ) : (
                    <Route className="w-4 h-4" />
                  )}
                  <span>{leftAlgoConfig.label}</span>
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {dropdownOpen.left && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                >
                  {availableLeftAlgorithms.map((algo) => (
                    <button
                      key={algo.id}
                      onClick={() => selectAlgorithm('left', algo.id)}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      {algo.enhanced ? (
                        <Sparkles className="w-4 h-4" />
                      ) : algo.id === "PSO" ? (
                        <Bird className="w-4 h-4" />
                      ) : (
                        <Route className="w-4 h-4" />
                      )}
                      <span>{algo.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            <span className="text-gray-400">vs</span>

            {/* Right Algorithm Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('right')}
                className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors min-w-[120px] justify-between"
              >
                <span className="flex items-center space-x-2">
                  {rightAlgoConfig.enhanced ? (
                    <Sparkles className="w-4 h-4" />
                  ) : rightAlgoConfig.id === "PSO" ? (
                    <Bird className="w-4 h-4" />
                  ) : (
                    <Route className="w-4 h-4" />
                  )}
                  <span>{rightAlgoConfig.label}</span>
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {dropdownOpen.right && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                >
                  {availableRightAlgorithms.map((algo) => (
                    <button
                      key={algo.id}
                      onClick={() => selectAlgorithm('right', algo.id)}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      {algo.enhanced ? (
                        <Sparkles className="w-4 h-4" />
                      ) : algo.id === "PSO" ? (
                        <Bird className="w-4 h-4" />
                      ) : (
                        <Route className="w-4 h-4" />
                      )}
                      <span>{algo.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-3 sm:gap-6">
        <AlgorithmComparisonPanel
          algorithm={leftAlgorithm}
          color={leftAlgoConfig.color}
          activeVMs={activeVMs}
          taskCounts={taskCounts}
          cpuLoads={cpuLoads}
          highlightedVM={highlightedVM}
          metrics={metrics[leftAlgorithm]}
          dataCenterConfig={dataCenterConfig}
          getVmStatus={getVmStatus}
          getStatusColor={getStatusColor}
        />
        
        <AlgorithmComparisonPanel
          algorithm={rightAlgorithm}
          color={rightAlgoConfig.color}
          activeVMs={activeVMs}
          taskCounts={taskCounts}
          cpuLoads={cpuLoads}
          highlightedVM={highlightedVM}
          metrics={metrics[rightAlgorithm]}
          dataCenterConfig={dataCenterConfig}
          getVmStatus={getVmStatus}
          getStatusColor={getStatusColor}
        />
      </div>

      {/* Cross Comparison Metrics */}
      {(metrics[leftAlgorithm] && metrics[rightAlgorithm]) && (
        <div className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CrossComparisonMetrics 
              enhancedMetrics={metrics[leftAlgorithm]} 
              baselineMetrics={metrics[rightAlgorithm]}
              enhancedLabel={leftAlgoConfig.label}
              baselineLabel={rightAlgoConfig.label}
              enhancedColor={leftAlgoConfig.color}
            />
          </motion.div>
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
      icon: "",
      label: "PSO",
      bgColor: "green",
      description: "Particle Swarm Optimization"
    },
    ACO: {
      icon: "",
      label: "ACO",
      bgColor: "orange",
      description: "Ant Colony Optimization"
    },
  };

  const config = algorithmConfig[algorithm];

  const borderColorClasses = {
    blue: "border-blue-100",
    purple: "border-purple-100",
    green: "border-green-100",
    orange: "border-orange-100",
  };

  const headerTextClasses = {
    blue: "text-blue-600",
    purple: "text-purple-600",
    green: "text-green-600",
    orange: "text-orange-600",
  };

  const chipBgClasses = {
    blue: "bg-blue-600",
    purple: "bg-purple-600",
    green: "bg-green-600",
    orange: "bg-orange-600",
  };

  const borderClass = borderColorClasses[config.bgColor] || "border-gray-100";
  const headerTextClass = headerTextClasses[config.bgColor] || "text-gray-700";
  const chipBgClass = chipBgClasses[config.bgColor] || "bg-gray-600";

  return (
    <motion.div
      className={`bg-white p-3 sm:p-6 rounded-xl shadow-sm border ${borderClass}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex-1">
          <h5 className={`font-bold text-base sm:text-lg ${headerTextClass} flex items-center mb-1`}>
            {algorithm === "EPSO" || algorithm === "EACO" ? (
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            ) : algorithm === "PSO" ? (
              <Bird className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            ) : algorithm === "ACO" ? (
              <Route className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            ) : (
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={config.icon} />
              </svg>
            )}
            <span>{config.label}</span>
          </h5>
          <p className="text-xs text-gray-500 mb-2">{config.description}</p>
        </div>
        <span className={`text-xs sm:text-sm ${chipBgClass} text-white px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0 ml-2`}>
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
      <div className="text-center mb-4">
        <h6 className="text-lg font-bold text-gray-800">
          {enhancedLabel} vs {baselineLabel} Comparison
        </h6>
        <p className="text-sm text-gray-600">
          Percentage improvement of {enhancedLabel} over {baselineLabel}
        </p>
      </div>
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