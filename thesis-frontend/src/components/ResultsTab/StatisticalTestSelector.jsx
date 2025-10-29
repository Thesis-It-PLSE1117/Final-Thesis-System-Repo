import React from "react";
import { BarChart3, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

/**
 * tab-based selector for switching between statistical test displays.
 * only renders when multiple tests are available.
 *
 * @param {Object} props - Component props
 * @param {string} props.activeTest - Currently active test ('ttest' or 'wilcoxon')
 * @param {Function} props.onTestChange - Callback when test selection changes
 * @param {boolean} props.hasTTest - Whether t-test results are available
 * @param {boolean} props.hasWilcoxon - Whether Wilcoxon results are available
 * @returns {JSX.Element|null} Rendered selector or null if < 2 tests available
 */
const StatisticalTestSelector = ({
  activeTest,
  onTestChange,
  hasTTest,
  hasWilcoxon,
}) => {
  const tests = [
    {
      id: "ttest",
      label: "Paired T-Test",
      icon: BarChart3,
      available: hasTTest,
      description: "Parametric analysis",
    },
    {
      id: "wilcoxon",
      label: "Wilcoxon Test",
      icon: BarChart3,
      available: hasWilcoxon,
      description: "Non-parametric analysis",
    },
  ];

  const availableTests = tests.filter((test) => test.available);

  if (availableTests.length <= 1) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 mb-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="text-[#319694]" size={18} />
          <h3 className="font-semibold text-gray-800 text-base">
            Statistical Analysis Type
          </h3>
        </div>
        <div className="flex gap-2 flex-wrap">
          {availableTests.map((test) => {
            const Icon = test.icon;
            const isActive = activeTest === test.id;

            return (
              <button
                key={test.id}
                onClick={() => onTestChange(test.id)}
                disabled={!test.available}
                className={`
                  relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? test.id === "ttest"
                        ? "bg-[#319694] text-white shadow-md"
                        : "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-sm"
                  }
                  ${!test.available && "opacity-50 cursor-not-allowed"}
                `}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{test.label}</span>
                <span className="sm:hidden">
                  {test.id === "ttest" ? "T-Test" : "Wilcoxon"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {availableTests.length === 2 && (
        <div className="mt-3 text-sm sm:text-sm text-gray-500 flex items-start gap-2">
          <svg
            className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <p className="leading-relaxed">
            Both tests are available. Use T-Test for normal data. Use Wilcoxon for non-normal data or small samples.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default StatisticalTestSelector;
