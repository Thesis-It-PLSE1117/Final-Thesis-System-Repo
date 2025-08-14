import { motion } from 'framer-motion';
import { Repeat, Info, TrendingUp, BarChart3 } from 'lucide-react';

const IterationTab = ({ config, onChange }) => {
  const handleIterationChange = (value) => {
    const iterations = Math.max(1, Math.min(100, parseInt(value) || 1));
    onChange({ iterations });
  };

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
            <h3 className="text-xl font-semibold text-gray-800">Iteration Settings</h3>
            <p className="text-sm text-gray-600">Run multiple simulations for statistical analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Iterations
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={config.iterations || 1}
              onChange={(e) => handleIterationChange(e.target.value)}
              placeholder="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#319694] focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Between 1 and 100 iterations (30+ recommended for academic research)
            </p>
          </div>

          <div className="flex items-center">
            <div className="bg-[#f0fdf4] border border-[#86efac] rounded-lg p-4 w-full">
              <p className="text-sm font-medium text-[#16a34a]">
                Estimated Time: ~{Math.ceil((config.iterations || 30) * 2.5)} seconds
              </p>
              <p className="text-xs text-[#15803d] mt-1">
                {(config.iterations || 30) > 1 ? 'Running in parallel (up to 4 at a time)' : 'Single run mode'}
              </p>
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
            <h4 className="text-lg font-medium text-gray-800">What This Does</h4>
          </div>
          
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-[#319694] mt-1">•</span>
              <span>Runs the simulation {config.iterations || 30} time{(config.iterations || 30) > 1 ? 's' : ''} with the same configuration</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#319694] mt-1">•</span>
              <span>Each run uses the same parameters but may produce slightly different results</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#319694] mt-1">•</span>
              <span>Helps identify performance consistency and reliability</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#319694] mt-1">•</span>
              <span>Useful for academic research and benchmarking</span>
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
            <h4 className="text-lg font-medium text-gray-800">Statistics You'll Get</h4>
          </div>
          
          {(config.iterations || 30) > 1 ? (
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <TrendingUp className="text-[#319694] mt-0.5" size={16} />
                <span><strong>Average:</strong> Mean value across all runs</span>
              </li>
              <li className="flex items-start gap-2">
                <TrendingUp className="text-[#319694] mt-0.5" size={16} />
                <span><strong>Min/Max:</strong> Best and worst case results</span>
              </li>
              <li className="flex items-start gap-2">
                <TrendingUp className="text-[#319694] mt-0.5" size={16} />
                <span><strong>Std Deviation:</strong> Measure of result variability</span>
              </li>
              <li className="flex items-start gap-2">
                <TrendingUp className="text-[#319694] mt-0.5" size={16} />
                <span><strong>Success Rate:</strong> Percentage of successful runs</span>
              </li>
            </ul>
          ) : (
            <p className="text-sm text-gray-500">
              Enable multiple iterations to see statistical analysis
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
          <h4 className="font-medium text-gray-800">Recommendations</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-3">
            <p className="font-medium text-[#319694]">Quick Test</p>
            <p className="text-gray-600">1-5 iterations for basic validation</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="font-medium text-[#319694]">Research</p>
            <p className="text-gray-600">30-50 iterations for reliable statistics</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="font-medium text-[#319694]">Publication</p>
            <p className="text-gray-600">50-100 iterations for academic papers</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default IterationTab;
