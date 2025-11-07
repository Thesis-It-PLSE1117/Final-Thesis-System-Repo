import React from "react";
import { motion } from "framer-motion";
import {
  Cloud,
  HardDrive,
  Cpu,
  Network,
  Database,
  Server,
  Clock,
  Activity,
  Info,
  Repeat,
  X,
  AlertTriangle,
} from "lucide-react";
import {
  ICON_SIZES,
  CARD_SIZES,
  SPACING_SCALE,
} from "../../constants/designSystem";

const CloudLoadingModal = ({
  numCloudlets,
  numHosts,
  numVMs,
  progress,
  iterations = 1,
  onAbort,
  canAbort = false,
  isAborting = false,
  currentIteration = null,
  iterationStage = null,
  totalTasks = null,
  eta = null,
  message = null,
}) => {
  const [elapsedTime, setElapsedTime] = React.useState(0);
  const [showConfirmCancel, setShowConfirmCancel] = React.useState(false);

  const isLargeTaskSet = (totalTasks || numCloudlets) > 5000;
  const isMultipleIterations = iterations > 1;
  const effectiveTaskCount = totalTasks || numCloudlets;

  const actualCurrentIteration =
    currentIteration || (isMultipleIterations ? 1 : 1);
  const displayStage =
    iterationStage || (currentIteration ? "Processing..." : null);

  // Reset state when modal appears or when key props change
  React.useEffect(() => {
    // Reset elapsed time and confirm cancel state
    setElapsedTime(0);
    setShowConfirmCancel(false);
    
    // Reset current tip index to 0
    setCurrentTipIndex(0);
  }, [numCloudlets, numHosts, numVMs, iterations, totalTasks]); // Reset when these key props change

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getOverallProgress = () => {
    if (!isMultipleIterations || iterations <= 1) {
      return progress;
    }

    const progressPerIteration = 100 / iterations;
    const minProgress = (actualCurrentIteration - 1) * progressPerIteration;
    const currentIterationProgress = (progress * progressPerIteration) / 100;
    const totalProgress = minProgress + currentIterationProgress;
    
    return Math.min(totalProgress, 99);
  };

  const overallProgress = getOverallProgress();

  const getIterationBasedEta = () => {
    if (iterations > 1 && actualCurrentIteration > 0) {
      const avgTimePerIteration = elapsedTime / actualCurrentIteration;
      const remainingIterations = iterations - actualCurrentIteration;
      return Math.round(avgTimePerIteration * remainingIterations);
    }
    
    if (iterations === 1 && elapsedTime > 2) {
      const taskCount = effectiveTaskCount;
      const baseTimePerTask = 0.015;
      const estimatedTotalTime = taskCount * baseTimePerTask;
      const remainingTime = estimatedTotalTime - elapsedTime;
      
      if (remainingTime > 0 && overallProgress < 95) {
        return Math.round(remainingTime);
      }
    }
    
    return null;
  };

  const estimatedTimeRemaining = getIterationBasedEta();

  React.useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCancelClick = () => {
    setShowConfirmCancel(true);
  };

  const handleConfirmCancel = () => {
    setShowConfirmCancel(false);
    onAbort();
  };

  const handleCancelCancel = () => {
    setShowConfirmCancel(false);
  };

  const tips = [
    "For robust statistical analysis, use 50 or more iterations to ensure reliable comparison results.",
    "EPSO and EACO are enhanced optimization algorithms designed for better cloud resource scheduling.",
    "The simulation balances multiple objectives: execution time, cost efficiency, energy usage, and load distribution.",
    "Higher iteration counts provide more accurate performance metrics and confidence in algorithm comparison.",
  ];

  const [currentTipIndex, setCurrentTipIndex] = React.useState(0);

  React.useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }, 15000);

    return () => clearInterval(tipInterval);
  }, [tips.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-labelledby="cloud-loading-title"
    >
      {/* Blurred background overlay */}
      <motion.div
        className="absolute inset-0 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Confirmation Dialog */}
      {showConfirmCancel && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute z-20 bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-gray-200"
        >
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">
                Stop Simulation?
              </h3>
              <p className="text-sm text-gray-600">
                Are you sure you want to stop the simulation? All progress will be lost and this action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleCancelCancel}
                className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-200"
              >
                Continue
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Stop
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main modal container */}
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 15 }}
        className="relative bg-white rounded-xl p-5 max-w-md w-full mx-4 shadow-2xl border border-gray-100"
      >
        {isAborting && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-semibold text-gray-800">Cancelling Simulation</h4>
                <p className="text-sm text-gray-600">Please wait while the simulation stops...</p>
              </div>
            </div>
          </div>
        )}
        
        {canAbort && (
          <motion.button
            onClick={handleCancelClick}
            disabled={isAborting || showConfirmCancel}
            className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={isAborting ? "Stopping simulation..." : "Stop simulation"}
          >
            {isAborting ? (
              <div className="animate-spin motion-reduce:animate-none rounded-full h-3.5 w-3.5 border-2 border-red-500 border-t-transparent" />
            ) : (
              <X size={ICON_SIZES.sm} />
            )}
          </motion.button>
        )}

        {/* Header */}
        <div className="flex items-center justify-center mb-3">
          <div className="p-2 bg-[#319694]/10 rounded-lg mr-2.5">
            <Activity size={ICON_SIZES.lg} className="text-[#319694]" />
          </div>
          <h3
            id="cloud-loading-title"
            className="text-lg font-bold text-gray-800"
          >
            Simulation Processing
          </h3>
        </div>

        <div className="flex justify-center mb-5">
          <div className="relative w-28 h-28">
            <div className="absolute inset-0 border-4 border-[#319694]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#319694] rounded-full animate-spin motion-reduce:animate-none"></div>
            <div
              className="absolute inset-4 border-4 border-transparent border-b-[#4fd1c5] rounded-full animate-spin motion-reduce:animate-none"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Server className="text-[#319694]" size={ICON_SIZES.xxl} />
            </div>
          </div>
        </div>

        {/* Enhanced Progress Information */}
        <div className="mb-3">
          {/* time information */}
          <div className="flex justify-center items-center mb-1.5">
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Clock size={ICON_SIZES.xs} />
              <span>{formatTime(elapsedTime)} elapsed</span>
            </div>
          </div>

          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Overall Progress</span>
            <span>{Math.round(Math.min(overallProgress, 99))}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full bg-gradient-to-r from-[#319694] to-[#4fd1c5]"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(overallProgress, 99)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {estimatedTimeRemaining !== null && (
            <div className="flex justify-center items-center mt-1.5">
              <div className="text-sm text-gray-600">
                Approximately {formatTime(estimatedTimeRemaining)} remaining
              </div>
            </div>
          )}
        </div>

        {message ? (
          <div className="mb-3 p-2.5 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-800 font-medium">
              {message}
            </div>
          </div>
        ) : (
          <div className="mb-3 min-h-[2.5rem] flex items-center justify-center">
            <motion.p
              key={currentTipIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="text-xs text-center text-gray-500 italic px-4"
            >
              {tips[currentTipIndex]}
            </motion.p>
          </div>
        )}

        {iterations > 1 && (
          <div className="mb-3 p-2.5 bg-[#319694]/5 rounded-lg border border-[#319694]/20">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Repeat className="text-[#319694]" size={ICON_SIZES.sm} />
              <span className="text-gray-700 font-medium text-sm">
                Multiple Iterations
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Iteration {actualCurrentIteration} of {iterations}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
            <div className="flex items-center gap-1.5">
              <Server className="text-[#319694]" size={ICON_SIZES.sm} />
              <div>
                <div className="font-medium text-gray-700 text-sm">Hosts</div>
                <div className="text-gray-900 font-semibold text-sm">
                  {numHosts}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
            <div className="flex items-center gap-1.5">
              <Database className="text-[#319694]" size={ICON_SIZES.sm} />
              <div>
                <div className="font-medium text-gray-700 text-sm">Tasks</div>
                <div className="text-gray-900 font-semibold text-sm flex items-center gap-1">
                  {effectiveTaskCount.toLocaleString()}
                  {isLargeTaskSet && (
                    <AlertTriangle size={14} className="text-amber-600" />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
            <div className="flex items-center gap-1.5">
              <HardDrive className="text-[#319694]" size={ICON_SIZES.sm} />
              <div>
                <div className="font-medium text-gray-700 text-sm">VMs</div>
                <div className="text-gray-900 font-semibold text-sm">
                  {numVMs}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CloudLoadingModal;