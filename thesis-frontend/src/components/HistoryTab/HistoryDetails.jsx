import { useState } from "react";
import {
  BarChart2,
  Clock,
  Cpu,
  Zap,
  Activity,
  TrendingUp,
  Award,
  Eye,
  FileText,
  Calendar,
  Settings,
  Database,
  CheckCircle,
  AlertCircle,
  Info,
  Timer,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion } from "framer-motion";

const HistoryDetails = ({ result, onViewResults }) => {
  const [openSections, setOpenSections] = useState({
    performance: true,
    configuration: true,
    visualization: true,
    statistical: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleViewResults = (result) => {
    // Log statistical analysis if available
    if (!isSingleIteration && result.tTestResults) {
    }

    // Log plot analysis if available
    if (result.plotAnalysis) {
    }

    // Call the original onViewResults function if it exists
    if (onViewResults) {
      onViewResults(result);
    }
  };

  if (!result) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-[#319694]/15 p-8">
        <div className="text-center text-gray-500">
          <Database size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">No Simulation Selected</p>
          <p className="text-sm">
            Select a simulation from the history list to view its details
          </p>
        </div>
      </div>
    );
  }

  // Safely access properties with defaults
  let summary = result.summary || {};
  if (typeof summary === "string") {
    try {
      summary = JSON.parse(summary);
    } catch (e) {
      console.warn("Failed to parse summary:", e);
      summary = {};
    }
  }
  const config = result.config || {};

  // Check if this is a single iteration run
  const isSingleIteration =
    result.rawResults?.totalIterations === 1 ||
    !result.rawResults?.individualResults ||
    result.rawResults?.individualResults?.length === 1;

  // Calculate metrics from individualResults (for multi-iteration runs)
  const calculateMetricFromIndividual = (metricName) => {
    const individualResults = result.rawResults?.individualResults;
    if (
      !individualResults ||
      !Array.isArray(individualResults) ||
      individualResults.length === 0
    ) {
      return 0;
    }

    // Get all values for this metric from individual results
    const values = individualResults
      .map((item) => item.summary?.[metricName] || 0)
      .filter((val) => typeof val === "number" && !isNaN(val));

    if (values.length === 0) return 0;

    // Return the average
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  };

  const getEnergyValue = (energyData) => {
    if (typeof energyData === "number") {
      return energyData;
    }
    if (energyData && typeof energyData === "object") {
      return energyData.totalEnergyWh || 0;
    }
    return 0;
  };

  const getMetric = (metricName) => {
    if (metricName === "energyConsumption") {
      if (summary[metricName] !== undefined && summary[metricName] !== null) {
        const val = getEnergyValue(summary[metricName]);
        if (val > 0) return val;
      }
      if (summary.averageMetrics?.[metricName] !== undefined) {
        const val = getEnergyValue(summary.averageMetrics[metricName]);
        if (val > 0) return val;
      }
      if (result.rawResults?.summary?.[metricName] !== undefined) {
        const val = getEnergyValue(result.rawResults.summary[metricName]);
        if (val > 0) return val;
      }
      if (result.rawResults?.averageMetrics?.[metricName] !== undefined) {
        const val = getEnergyValue(result.rawResults.averageMetrics[metricName]);
        if (val > 0) return val;
      }
      
      if (!isSingleIteration) {
        const individualResults = result.rawResults?.individualResults;
        if (individualResults && Array.isArray(individualResults) && individualResults.length > 0) {
          const values = individualResults
            .map((item) => getEnergyValue(item.summary?.[metricName] || item[metricName]))
            .filter((val) => typeof val === "number" && !isNaN(val) && val > 0);
          if (values.length > 0) {
            return values.reduce((sum, val) => sum + val, 0) / values.length;
          }
        }
      }
      
      if (result[metricName] !== undefined && result[metricName] !== null) {
        const val = getEnergyValue(result[metricName]);
        if (val > 0) return val;
      }
      
      if (
        isSingleIteration &&
        result.rawResults?.individualResults?.[0]?.summary?.[metricName]
      ) {
        return getEnergyValue(result.rawResults.individualResults[0].summary[metricName]);
      }
      return 0;
    }

    if (summary[metricName] !== undefined && summary[metricName] !== null) {
      return summary[metricName];
    }

    if (summary.averageMetrics?.[metricName] !== undefined) {
      return summary.averageMetrics[metricName];
    }

    if (result.rawResults?.summary?.[metricName] !== undefined) {
      return result.rawResults.summary[metricName];
    }

    if (result.rawResults?.averageMetrics?.[metricName] !== undefined) {
      return result.rawResults.averageMetrics[metricName];
    }

    if (result[metricName] !== undefined) {
      return result[metricName];
    }

    if (!isSingleIteration) {
      return calculateMetricFromIndividual(metricName);
    }

    if (
      isSingleIteration &&
      result.rawResults?.individualResults?.[0]?.summary?.[metricName]
    ) {
      return result.rawResults.individualResults[0].summary[metricName];
    }

    return 0;
  };

  const metrics = [
    {
      icon: <Clock size={20} className="text-[#319694]" />,
      title: "Makespan",
      value: getMetric("makespan").toFixed(2),
      unit: "s",
    },
    {
      icon: <Timer size={20} className="text-[#319694]" />,
      title: "Response Time",
      value: (
        getMetric("responseTime") || getMetric("avgResponseTime")
      ).toFixed(2),
      unit: "s",
    },
    {
      icon: <Cpu size={20} className="text-[#319694]" />,
      title: "Resource Utilization",
      value: getMetric("resourceUtilization").toFixed(2),
      unit: "%",
    },
    {
      icon: <Zap size={20} className="text-[#319694]" />,
      title: "Energy Consumption",
      value: getMetric("energyConsumption").toFixed(3),
      unit: "Wh",
    },
    {
      icon: <Activity size={20} className="text-[#319694]" />,
      title: "Load Imbalance",
      value: getMetric("loadImbalance").toFixed(4),
      unit: "",
    },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Extract key statistical insights in readable format
  const getStatisticalSummary = (tTestResults) => {
    if (!tTestResults) return null;

    const summary = [];

    if (
      tTestResults.overallWinner &&
      tTestResults.overallWinner !== "No clear winner"
    ) {
      summary.push(
        `${tTestResults.overallWinner} shows superior performance overall`,
      );
    }

    if (tTestResults.significantDifferences && tTestResults.metricTests) {
      const totalMetrics = Object.keys(tTestResults.metricTests).length;
      summary.push(
        `Significant differences found in ${tTestResults.significantDifferences} out of ${totalMetrics} metrics`,
      );
    }

    if (tTestResults.sampleSize) {
      summary.push(`Analysis based on ${tTestResults.sampleSize} iterations`);
    }

    // Extract specific metric winners if available
    if (tTestResults.metricTests) {
      Object.entries(tTestResults.metricTests).forEach(([metric, test]) => {
        if (test.significant && test.winner) {
          const metricName = metric
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase());
          summary.push(
            `${test.winner} performs better in ${metricName.toLowerCase()}`,
          );
        }
      });
    }

    return summary;
  };

  const statisticalSummary = getStatisticalSummary(result.tTestResults);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-[#319694]/15"
    >
      {/* Header */}
      <div className="border-b border-[#319694]/15 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <BarChart2 size={24} className="text-[#319694]" />
              Simulation Analysis
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-gray-600">
                {result.algorithm} algorithm performance metrics
              </p>
              {isSingleIteration && (
                <span className="bg-blue-100 text-blue-800 text-sm px-2 py-0.5 rounded-full font-medium">
                  Single Iteration
                </span>
              )}
            </div>
          </div>
          <div className="text-right text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              {formatDate(result.timestamp)}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Performance Metrics - Collapsible Section */}
        <div className="border border-[#319694]/20 rounded-lg overflow-hidden">
          <button
            className="w-full p-4 bg-gray-50 flex items-center justify-between text-left hover:bg-gray-100 transition-colors"
            onClick={() => toggleSection("performance")}
          >
            <h4 className="font-medium text-gray-700 flex items-center gap-2">
              <TrendingUp size={16} className="text-[#319694]" />
              Performance Metrics
            </h4>
            {openSections.performance ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </button>

          {openSections.performance && (
            <div className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {metrics.map((metric, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 flex items-center"
                  >
                    <div className="bg-[#e0f7f6] p-2 rounded-full mr-4">
                      {metric.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500 truncate">
                        {metric.title}
                      </p>
                      <p className="text-xl font-semibold">
                        {metric.value}
                        {metric.unit && (
                          <span className="text-sm font-normal ml-1">
                            {metric.unit}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Configuration - Collapsible Section */}
        <div className="border border-[#319694]/20 rounded-lg overflow-hidden">
          <button
            className="w-full p-4 bg-gray-50 flex items-center justify-between text-left hover:bg-gray-100 transition-colors"
            onClick={() => toggleSection("configuration")}
          >
            <h4 className="font-medium text-gray-700 flex items-center gap-2">
              <Settings size={16} className="text-[#319694]" />
              Configuration
            </h4>
            {openSections.configuration ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </button>

          {openSections.configuration && (
            <div className="p-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Hosts</p>
                    <p className="font-semibold text-gray-800">
                      {config.numHosts || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">VMs</p>
                    <p className="font-semibold text-gray-800">
                      {config.numVMs || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Cloudlets</p>
                    <p className="font-semibold text-gray-800">
                      {config.numCloudlets || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Algorithm</p>
                    <p className="font-semibold text-gray-800">
                      {result.algorithm ||
                        config.optimizationAlgorithm ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">VM Scheduler</p>
                    <p className="font-semibold text-gray-800">
                      {config.vmScheduler || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Workload</p>
                    <p className="font-semibold text-gray-800">
                      {config.workloadType || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Statistical Analysis - Collapsible Section - Only show for multi-iteration */}
        {!isSingleIteration &&
          statisticalSummary &&
          statisticalSummary.length > 0 && (
            <div className="border border-[#319694]/20 rounded-lg overflow-hidden">
              <button
                className="w-full p-4 bg-gray-50 flex items-center justify-between text-left hover:bg-gray-100 transition-colors"
                onClick={() => toggleSection("statistical")}
              >
                <h4 className="font-medium text-gray-700 flex items-center gap-2">
                  <Award size={16} className="text-[#319694]" />
                  Statistical Insights
                </h4>
                {openSections.statistical ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>

              {openSections.statistical && (
                <div className="p-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      {statisticalSummary.map((insight, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 bg-white rounded-lg p-3"
                        >
                          <CheckCircle
                            size={16}
                            className="text-[#319694] mt-0.5 flex-shrink-0"
                          />
                          <span className="text-sm text-gray-700 leading-relaxed">
                            {insight}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        {/* Single Iteration Notice */}
        {isSingleIteration && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
            <div className="flex items-start">
              <Info
                size={20}
                className="text-blue-600 mt-0.5 mr-3 flex-shrink-0"
              />
              <div>
                <p className="text-blue-800 font-medium">
                  Single Iteration Run
                </p>
                <p className="text-blue-700 text-sm mt-1">
                  This simulation was run with a single iteration. Statistical
                  analysis requires multiple iterations for comparison.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4">
          <button
            onClick={() => handleViewResults(result)}
            className="w-full bg-[#319694] text-white px-6 py-4 rounded-lg hover:bg-[#267b79] transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
          >
            <BarChart2 size={18} />
            <span className="font-medium">View Detailed Results</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default HistoryDetails;
