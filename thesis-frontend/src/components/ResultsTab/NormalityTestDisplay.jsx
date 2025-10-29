import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Info,
  TrendingUp,
  Activity,
} from "lucide-react";

const NormalityTestDisplay = ({ normalityTests, normalityAnalysis }) => {
  const [expanded, setExpanded] = useState(false);

  if (!normalityTests || Object.keys(normalityTests).length === 0) {
    return null;
  }

  const getMetricLabel = (metricName) => {
    const labels = {
      makespan: "Total Completion Time (Makespan)",
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
  const preferredTest = normalityAnalysis?.preferredTest || "Unknown";

  const getTestIcon = (preferredTest) => {
    if (preferredTest.includes("T-Test")) {
      return <TrendingUp className="text-blue-600" size={20} />;
    } else if (preferredTest.includes("Wilcoxon")) {
      return <Activity className="text-purple-600" size={20} />;
    } else {
      return <AlertTriangle className="text-amber-600" size={20} />;
    }
  };

  const getTestColor = (preferredTest) => {
    if (preferredTest.includes("T-Test")) {
      return "from-blue-500 to-blue-600";
    } else if (preferredTest.includes("Wilcoxon")) {
      return "from-purple-500 to-indigo-600";
    } else {
      return "from-amber-500 to-orange-600";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
    >
      <div
        className={`bg-gradient-to-r ${getTestColor(preferredTest)} text-white p-4 sm:p-6`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getTestIcon(preferredTest)}
            <div>
              <h3 className="text-lg sm:text-xl font-bold">
                Normality Assessment
              </h3>
              <p className="text-sm text-white/90 mt-1">
               Researchers used Anderson-Darling for test results.
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {normalCount}/{totalCount}
            </div>
            <div className="text-sm text-white/90">Normal</div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div
          className={`bg-gradient-to-r ${getTestColor(preferredTest).replace("500", "50").replace("600", "100")} rounded-lg p-4 border-2 ${getTestColor(preferredTest).replace("from-", "border-").split(" ")[0].replace("500", "300")}`}
        >
          <div className="flex items-start gap-3">
            {getTestIcon(preferredTest)}
            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                Recommended Test
              </h4>
              <p className="text-lg font-semibold text-gray-900 mb-2">
                {preferredTest}
              </p>
              {normalityAnalysis?.conclusion && (
                <p className="text-sm text-gray-700 leading-relaxed">
                  {normalityAnalysis.conclusion}
                </p>
              )}
            </div>
          </div>
        </div>

        {normalityAnalysis?.practicalGuidance && (
          <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start gap-2">
              <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <h5 className="font-semibold text-gray-900 mb-1">
                  Practical Guidance
                </h5>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {normalityAnalysis.practicalGuidance}
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg flex items-center justify-between transition-colors"
        >
          <span>Per-Metric Normality Results</span>
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 space-y-3"
            >
              {Object.entries(normalityTests).map(([metric, test]) => (
                <div
                  key={metric}
                  className={`p-4 rounded-lg border-2 ${test.isNormal ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {test.isNormal ? (
                          <CheckCircle className="text-green-600" size={18} />
                        ) : (
                          <XCircle className="text-amber-600" size={18} />
                        )}
                        <h5 className="font-semibold text-gray-900">
                          {getMetricLabel(metric)}
                        </h5>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed mb-2">
                        {test.interpretation}
                      </p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">A² Statistic:</span>
                          <span className="ml-2 font-semibold text-gray-900">
                            {test.testStatistic?.toFixed(4) || "—"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">P-value:</span>
                          <span className="ml-2 font-semibold text-gray-900">
                            {test.pValue?.toFixed(4) || "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold ${test.isNormal ? "bg-green-200 text-green-800" : "bg-amber-200 text-amber-800"}`}
                    >
                      {test.isNormal ? "Normal" : "Non-Normal"}
                    </div>
                  </div>
                </div>
              ))}

              {normalityAnalysis?.methodologyNote && (
                <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h5 className="font-semibold text-gray-900 mb-2 text-sm">
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
  );
};

export default NormalityTestDisplay;
