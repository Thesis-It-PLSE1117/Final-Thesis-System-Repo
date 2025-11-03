import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, TrendingUp, Activity, AlertTriangle } from "lucide-react";
import { FEATURES } from "../../config/features";

const NormalityTestDisplay = ({ normalityTests, normalityAnalysis }) => {
  const [expanded, setExpanded] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  if (!normalityTests || Object.keys(normalityTests).length === 0) {
    return null;
  }

  const getMetricLabel = (metricName) => {
    const labels = {
      makespan: "Total Completion Time",
      energyConsumption: "Energy Consumption",
      resourceUtilization: "Resource Utilization",
      responseTime: "Average Response Time",
      loadBalance: "Degree of Imbalance",
    };
    return labels[metricName] || metricName;
  };

  const normalCount = Object.values(normalityTests).filter(
    (t) => t.isNormal
  ).length;
  const totalCount = Object.keys(normalityTests).length;
  
  let preferredTest = normalityAnalysis?.preferredTest || "Unknown";
  if (!FEATURES.ENABLE_WILCOXON && preferredTest.includes("Wilcoxon")) {
    preferredTest = "Paired T-Test";
  }

  const getTestIcon = (preferredTest) => {
    if (preferredTest.includes("T-Test")) {
      return <TrendingUp className="text-blue-600" size={18} />;
    } else if (preferredTest.includes("Wilcoxon")) {
      return <Activity className="text-purple-600" size={18} />;
    } else {
      return <AlertTriangle className="text-amber-600" size={18} />;
    }
  };

  const getTestColor = (preferredTest) => {
    if (preferredTest.includes("T-Test")) {
      return "blue";
    } else if (preferredTest.includes("Wilcoxon")) {
      return "purple";
    } else {
      return "amber";
    }
  };

  const testColor = getTestColor(preferredTest);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100"
    >
      {/* Header Section - Now clickable to collapse/expand entire component */}
      <div 
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-${testColor}-50 border border-${testColor}-200`}>
              {getTestIcon(preferredTest)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Normality Assessment
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Anderson-Darling test applied to all metrics.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {normalCount}/{totalCount}
              </div>
              <div className="text-sm text-gray-500">Normal metrics</div>
            </div>
            {expanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Test Recommendation Section */}
            <div className="p-6 bg-gray-50/50">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-3 h-3 rounded-full bg-${testColor}-500`} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    RECOMMENDED STATISTICAL TEST
                  </h4>
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    {preferredTest}
                  </p>
                  {normalityAnalysis?.conclusion && (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {normalityAnalysis.conclusion}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Practical Guidance Section */}
            {normalityAnalysis?.practicalGuidance && (
              <div className="p-6 bg-blue-50/30 border-l-4 border-blue-400">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-gray-900 mb-1">
                      Practical Guidance
                    </h5>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {normalityAnalysis.practicalGuidance}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Expandable Details Section */}
            <div className="p-6">
              <button
                onClick={() => setDetailsExpanded(!detailsExpanded)}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">Detailed results</span>
                  <span className="text-sm text-gray-500">({totalCount} metrics)</span>
                </div>
                {detailsExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              <AnimatePresence>
                {detailsExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-4"
                  >
                    {Object.entries(normalityTests).map(([metric, test]) => (
                      <div
                        key={metric}
                        className={`p-4 rounded-lg border-l-4 ${test.isNormal ? "border-green-400 bg-green-50/30" : "border-amber-400 bg-amber-50/30"}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div
                                className={`w-3 h-3 rounded-full ${test.isNormal ? "bg-green-500" : "bg-amber-500"}`}
                              />
                              <h5 className="font-semibold text-gray-900">
                                {getMetricLabel(metric)}
                              </h5>
                            </div>
                            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                              {FEATURES.ENABLE_WILCOXON 
                                ? test.interpretation 
                                : test.interpretation?.replace(/Wilcoxon[^.]*\.?/gi, '') || test.interpretation}
                            </p>
                            <div className="flex gap-6 text-sm">
                              <div>
                                <span className="text-gray-500 font-medium">A² Statistic: </span>
                                <span className="font-semibold text-gray-900">
                                  {test.testStatistic?.toFixed(4) || "—"}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500 font-medium">P-value: </span>
                                <span className="font-semibold text-gray-900">
                                  {test.pValue?.toFixed(4) || "—"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${test.isNormal ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}
                          >
                            {test.isNormal ? "Normal" : "Non-normal"}
                          </div>
                        </div>
                      </div>
                    ))}

                    {normalityAnalysis?.methodologyNote && (
                      <div className="p-4 rounded-lg bg-gray-100 border border-gray-200">
                        <h5 className="text-sm font-semibold text-gray-900 mb-2">
                          About Anderson-Darling Test
                        </h5>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {normalityAnalysis.methodologyNote}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NormalityTestDisplay;