import { motion } from 'framer-motion';
import { Repeat, CheckCircle, Clock } from 'lucide-react';

const IterationBadge = ({ iterationData }) => {
  if (!iterationData || !iterationData.totalIterations || iterationData.totalIterations === 1) {
    return null;
  }

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-[#319694]/10 to-[#2a827f]/10 border border-[#319694]/20 rounded-lg p-4 mb-6"
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#319694]/20 rounded-full">
            <Repeat className="text-[#319694]" size={20} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-800">
              Results from {iterationData.totalIterations} Iterations
            </h4>
            <p className="text-xs text-gray-600">
              Statistical analysis across multiple simulation runs
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-600" size={16} />
            <span className="text-gray-700">
              <span className="font-semibold">{iterationData.successRate?.toFixed(1)}%</span> Success Rate
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="text-blue-600" size={16} />
            <span className="text-gray-700">
              <span className="font-semibold">{formatTime(iterationData.totalExecutionTime)}</span> Simulation Runtime
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default IterationBadge;
