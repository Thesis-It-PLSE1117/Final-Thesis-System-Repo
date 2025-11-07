import { Play, Pause, RotateCcw } from 'lucide-react';
import { motion } from "framer-motion";

const Controls = ({ isPlaying, handlePlayPause, handleReset, progress, total, cloudlets }) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100 w-full">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">
        {/* Controls Section */}
        <div className="flex items-center gap-3 sm:gap-4 w-full">
          {/* Play/Pause Button */}
          <motion.button
            onClick={handlePlayPause}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:from-blue-600 hover:to-blue-700 active:shadow-inner"
            aria-label={isPlaying ? "Pause simulation" : "Play simulation"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </motion.button>

          {/* Reset Button */}
          <motion.button
            onClick={handleReset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 bg-gray-100 text-gray-700 p-3 rounded-full hover:bg-gray-200 transition-all border border-gray-200 hover:border-gray-300 active:bg-gray-300"
            aria-label="Reset simulation"
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>

          {/* Progress Section - Improved responsive layout */}
          <div className="flex-1 min-w-0 ml-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-2">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Progress
              </span>
              <span className="text-sm text-gray-600 whitespace-nowrap">
                {cloudlets} {cloudlets === 1 ? 'Task' : 'Tasks'}
              </span>
            </div>
            
            {/* Progress Bar Container - Full width */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden mb-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-300"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", damping: 25, stiffness: 100 }}
              />
            </div>
            
            {/* Progress Labels - Responsive alignment */}
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 whitespace-nowrap">
                Simulation Progress
              </span>
              <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
                {Math.round(progress)}% Complete
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;