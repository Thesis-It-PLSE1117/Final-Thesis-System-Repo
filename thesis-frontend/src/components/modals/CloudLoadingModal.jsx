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
  const [currentPhase, setCurrentPhase] = React.useState("initializing");

  const isLargeTaskSet = (totalTasks || numCloudlets) > 1000;
  const isMultipleIterations = iterations > 1;
  const effectiveTaskCount = totalTasks || numCloudlets;

  const actualCurrentIteration =
    currentIteration || (isMultipleIterations ? 1 : 1);
  const displayStage =
    iterationStage || (currentIteration ? "Processing..." : null);

  // Calculate overall progress based on iterations
  const getOverallProgress = () => {
    if (!isMultipleIterations || iterations <= 1) {
      return progress;
    }

    // Calculate progress range for current iteration
    const progressPerIteration = 100 / iterations;
    const minProgress = (actualCurrentIteration - 1) * progressPerIteration;
    const currentIterationProgress = (progress * progressPerIteration) / 100;
    
    // Total progress is base from previous iterations + current iteration progress
    const totalProgress = minProgress + currentIterationProgress;
    
    return Math.min(totalProgress, 99);
  };

  const overallProgress = getOverallProgress();

  React.useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    if (overallProgress < 10) setCurrentPhase("initializing");
    else if (overallProgress < 30) setCurrentPhase("scheduling");
    else if (overallProgress < 60) setCurrentPhase("simulating");
    else if (overallProgress < 90) setCurrentPhase("analyzing");
    else setCurrentPhase("finalizing");
  }, [overallProgress]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const estimateRemainingTime = () => {
    // Use backend ETA if available
    if (eta && eta > 0) {
      return `Approximately ${formatTime(eta)} remaining`;
    }

    if (overallProgress === 0 || elapsedTime === 0) {
      if (isLargeTaskSet) {
        const baseTimePerTask = 0.12;
        const iterationMultiplier = isMultipleIterations ? iterations : 1;
        const totalEstimatedSeconds =
          effectiveTaskCount * baseTimePerTask * iterationMultiplier;

        const overhead = isMultipleIterations ? totalEstimatedSeconds * 0.3 : 0;
        const finalEstimate = totalEstimatedSeconds + overhead;

        const estimatedMinutes = Math.ceil(finalEstimate / 60);
        return `Estimated time: ${estimatedMinutes} minutes for ${effectiveTaskCount.toLocaleString()} tasks${isMultipleIterations ? ` × ${iterations} iterations` : ""}`;
      } else if (isMultipleIterations) {
        const estimatedMinutes = Math.ceil((iterations * 30) / 60); // ~30 seconds per iteration
        return `Estimated time: ${estimatedMinutes} minutes for ${iterations} iterations`;
      }
      return "Estimating time...";
    }

    const safeProgress = Math.min(overallProgress, 85);
    const estimatedTotal = (elapsedTime / safeProgress) * 100;
    let remaining = Math.max(0, estimatedTotal - elapsedTime);

    if (isLargeTaskSet) {
      const conservativeBuffer = 1.4;
      remaining = remaining * conservativeBuffer;

      if (isMultipleIterations && actualCurrentIteration < iterations) {
        const iterationsLeft = iterations - actualCurrentIteration;
        const avgTimePerIteration =
          elapsedTime / Math.max(1, actualCurrentIteration);
        const iterationTimeRemaining = iterationsLeft * avgTimePerIteration;
        remaining = Math.max(remaining, iterationTimeRemaining);
      }

      return `Approximately ${formatTime(Math.round(remaining))} remaining`;
    }

    return `Approximately ${formatTime(Math.round(remaining))} remaining`;
  };

  const tips = [
    "EPSO and EACO are enhanced optimization algorithms designed for better cloud resource scheduling.",
    "The simulation balances multiple objectives: execution time, cost efficiency, energy usage, and load distribution.",
    "Both algorithms are optimized for convergence speed while maintaining high solution quality.",
    "Results include detailed performance metrics and statistical comparisons between algorithms.",
  ];

  const [currentTipIndex, setCurrentTipIndex] = React.useState(0);

  React.useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }, 15000);

    return () => clearInterval(tipInterval);
  }, []);

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
            onClick={onAbort}
            disabled={isAborting}
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

          {/* Enhanced ETA Display */}
          <div className="flex justify-center items-center mt-1.5">
            <div className="text-sm text-gray-600">
              {estimateRemainingTime()}
            </div>
          </div>
        </div>

        <div className="mb-3 p-2.5 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-1.5 mb-1">
            <Info className="text-gray-600" size={ICON_SIZES.sm} />
            <span className="text-gray-700 font-medium text-sm">
              Processing Information
            </span>
          </div>
          {message ? (
            <div className="text-sm text-gray-700 font-medium mb-2">
              {message}
            </div>
          ) : null}

          <motion.p
            key={currentTipIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.5 }}
            className="text-sm text-gray-600 leading-relaxed"
          >
            {tips[currentTipIndex]}
          </motion.p>
        </div>

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
                <div className="text-gray-900 font-semibold text-sm">
                  {effectiveTaskCount.toLocaleString()}
                  {isLargeTaskSet && (
                    <span className="text-sm text-amber-600 ml-1">⚠</span>
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