import { motion } from "framer-motion";
import {
  Repeat,
  Info,
  TrendingUp,
  BarChart3,
  Circle,
  Zap,
  FlaskConical,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";

const IterationTab = ({ config, onChange }) => {
  const handleIterationChange = (value) => {
    const iterations = Math.max(1, Math.min(50, parseInt(value) || 1));
    onChange({ iterations });
  };

  // Use consistent default value
  const currentIterations = config.iterations || 1;

  return (
    <div className="space-y-6">
      {/* Main Configuration Card */}
      <motion.div
        className="bg-white p-6 rounded-xl shadow-sm border border-[#319694]/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#319694]/10 rounded-lg">
            <Repeat className="text-[#319694]" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Iteration Settings
            </h3>
            <p className="text-sm text-gray-600">
              Run multiple tests to get reliable results.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Iterations
              </label>

              {/* Quick Select Presets */}
              <div className="flex flex-wrap gap-2 mb-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleIterationChange(1)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentIterations === 1
                      ? "bg-[#319694] text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-300 hover:border-[#319694] hover:bg-[#319694]/5"
                  }`}
                >
                  <Zap size={14} />
                  <span>Single (1)</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleIterationChange(30)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentIterations === 30
                      ? "bg-[#319694] text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-300 hover:border-[#319694] hover:bg-[#319694]/5"
                  }`}
                >
                  <FlaskConical size={14} />
                  <span>Testing (30)</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleIterationChange(50)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentIterations === 50
                      ? "bg-[#319694] text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-300 hover:border-[#319694] hover:bg-[#319694]/5"
                  }`}
                >
                  <GraduationCap size={14} />
                  <span>Research (50)</span>
                </motion.button>
              </div>

              <input
                type="number"
                min="1"
                max="50"
                value={currentIterations}
                onChange={(e) => handleIterationChange(e.target.value)}
                placeholder="1"
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#319694] focus:border-transparent bg-gray-100 cursor-not-allowed"
              />
              <p className="text-sm text-gray-500 mt-1">
                Select 1 to 50 test runs. We recommend 30+ iterations for statistically reliable research results.
              </p>
            </div>
          </div>

          {/* Status Card - Fixed Alignment */}
          <div className="flex flex-col justify-center">
            <div className="bg-[#319694]/5 border border-[#319694]/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-[#319694] mt-0.5 flex-shrink-0" size={18} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {currentIterations > 1
                      ? "Multiple Runs Selected"
                      : "Single Run Selected"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {currentIterations === 1
                      ? "Fast test mode for quick comparisons."
                      : currentIterations >= 30
                        ? "Statistical analysis available."
                        : `${currentIterations} runs for basic averaging.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* What This Does */}
        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-[#319694]/10"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-[#319694]/10 rounded-lg">
              <Info className="text-[#319694]" size={20} />
            </div>
            <h4 className="text-lg font-medium text-gray-800">How It Works</h4>
          </div>

          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <Circle
                className="text-[#319694] mt-1"
                size={6}
                fill="currentColor"
              />
              <span>
                The system runs the test {currentIterations} time
                {currentIterations > 1 ? "s" : ""} with the identical configuration settings.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Circle
                className="text-[#319694] mt-1"
                size={6}
                fill="currentColor"
              />
              <span>
                Each iteration uses the same parameters but may produce slightly different results.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Circle
                className="text-[#319694] mt-1"
                size={6}
                fill="currentColor"
              />
              <span>
                Multiple iterations reveal performance consistency and statistical reliability.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Circle
                className="text-[#319694] mt-1"
                size={6}
                fill="currentColor"
              />
              <span>
                Essential for academic research and rigorous algorithm comparison.
              </span>
            </li>
          </ul>
        </motion.div>

        {/* Statistics You'll Get */}
        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-[#319694]/10"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-[#319694]/10 rounded-lg">
              <BarChart3 className="text-[#319694]" size={20} />
            </div>
            <h4 className="text-lg font-medium text-gray-800">
              Results You'll Get
            </h4>
          </div>

          {currentIterations >= 30 ? (
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <TrendingUp className="text-[#319694] mt-0.5" size={16} />
                <span>
                  <strong>Paired T-Test:</strong> Statistical significance analysis with p-values and t-statistics on normally distributed data.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <TrendingUp className="text-[#319694] mt-0.5" size={16} />
                <span>
                  <strong>Average Performance:</strong> Mean results calculated across all test iterations.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <TrendingUp className="text-[#319694] mt-0.5" size={16} />
                <span>
                  <strong>Detailed Breakdown:</strong> Individual results for each iteration with data export options.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <TrendingUp className="text-[#319694] mt-0.5" size={16} />
                <span>
                  <strong>Winner Analysis:</strong> Statistically determined best-performing algorithm based on your simulation.
                </span>
              </li>
            </ul>
          ) : currentIterations > 1 ? (
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <TrendingUp className="text-[#319694] mt-0.5" size={16} />
                <span>
                  <strong>Average Performance:</strong> Mean results calculated
                  from {currentIterations} runs.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <TrendingUp className="text-[#319694] mt-0.5" size={16} />
                <span>
                  <strong>Individual Results:</strong> Breakdown available for
                  each iteration.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <TrendingUp className="text-[#319694] mt-0.5" size={16} />
                <span>
                  <strong>Basic Comparison:</strong> Side-by-side algorithm
                  performance analysis.
                </span>
              </li>
            </ul>
          ) : (
            <p className="text-sm text-gray-500">
              Single iteration provides basic algorithm comparison with visual analysis but without statistical testing.
            </p>
          )}
        </motion.div>
      </div>

      {/* Recommendations */}
      <motion.div
        className="bg-[#319694]/5 border border-[#319694]/10 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-[#319694]/10 rounded">
            <Info className="text-[#319694]" size={18} />
          </div>
          <h4 className="font-medium text-gray-800">Recommended Settings</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-3">
            <p className="font-medium text-[#319694]">
              Quick Test (1 iteration)
            </p>
            <p className="text-gray-600">
              Provides both algorithm analysis with visualization.
            </p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="font-medium text-[#319694]">
              Research (30-50 iterations)
            </p>
            <p className="text-gray-600">
              Generates statistically reliable results for academic evaluation.
            </p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="font-medium text-[#319694]">
              Publication (50 iterations)
            </p>
            <p className="text-gray-600">
              Delivers high-confidence statistical validation for formal research.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default IterationTab;