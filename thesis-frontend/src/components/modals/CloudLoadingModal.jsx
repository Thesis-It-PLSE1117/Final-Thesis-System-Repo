import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, HardDrive, Cpu, Network, Database, Server, Clock, Activity, Info, Repeat, X } from 'lucide-react';

const CloudLoadingModal = ({ numCloudlets, numHosts, numVMs, progress, iterations = 1, onAbort, canAbort = false, isAborting = false }) => {
  const [elapsedTime, setElapsedTime] = React.useState(0);
  const [currentPhase, setCurrentPhase] = React.useState('initializing');
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  

  React.useEffect(() => {
    if (progress < 10) setCurrentPhase('initializing');
    else if (progress < 30) setCurrentPhase('scheduling');
    else if (progress < 60) setCurrentPhase('simulating');
    else if (progress < 90) setCurrentPhase('analyzing');
    else setCurrentPhase('finalizing');
  }, [progress]);
  

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  

  const estimateRemainingTime = () => {
    if (progress === 0 || elapsedTime === 0) return 'Estimating time...';
    const estimatedTotal = (elapsedTime / progress) * 100;
    const remaining = Math.max(0, estimatedTotal - elapsedTime);
    return `Approximately ${formatTime(Math.round(remaining))} remaining`;
  };
  
  const tips = [
    "EPSO and EACO are enhanced optimization algorithms designed for better cloud resource scheduling.",
    "The simulation balances multiple objectives: execution time, cost efficiency, energy usage, and load distribution.",
    "Both algorithms are optimized for convergence speed while maintaining high solution quality.",
    "Results include detailed performance metrics and statistical comparisons between algorithms."
  ];
  
  const [currentTipIndex, setCurrentTipIndex] = React.useState(0);
  
  React.useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTipIndex(prev => (prev + 1) % tips.length);
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
        transition={{ type: 'spring', damping: 15 }}
        className="relative bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-100"
      >
        {canAbort && (
          <motion.button
            onClick={onAbort}
            disabled={isAborting}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-[#319694] hover:bg-gray-50 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={isAborting ? "Stopping simulation..." : "Stop simulation"}
          >
            {isAborting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#319694] border-t-transparent" />
            ) : (
              <X size={16} />
            )}
          </motion.button>
        )}
        
        {/* Header */}
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-[#319694]/10 rounded-lg mr-3">
            <Activity size={24} className="text-[#319694]" />
          </div>
          <h3 id="cloud-loading-title" className="text-xl font-bold text-gray-800">
            Simulation Processing
          </h3>
        </div>


        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 border-4 border-[#319694]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#319694] rounded-full animate-spin"></div>
            <div className="absolute inset-4 border-4 border-transparent border-b-[#4fd1c5] rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Server className="text-[#319694]" size={32} />
            </div>
          </div>
        </div>

        {/* Enhanced Progress Information */}
        <div className="mb-4">
          {/* time information */}
          <div className="flex justify-center items-center mb-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={14} />
              <span>{formatTime(elapsedTime)} elapsed</span>
            </div>
          </div>
          
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Overall Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div
              className="h-2.5 rounded-full bg-gradient-to-r from-[#319694] to-[#4fd1c5]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <Info className="text-gray-600" size={16} />
            <span className="text-gray-700 font-medium text-sm">Processing Information</span>
          </div>
          <motion.p 
            key={currentTipIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.5 }}
            className="text-xs text-gray-600 leading-relaxed"
          >
            {tips[currentTipIndex]}
          </motion.p>
        </div>
        
        {iterations > 1 && (
          <div className="mb-4 p-3 bg-[#319694]/5 rounded-lg border border-[#319694]/20">
            <div className="flex items-center gap-2">
              <Repeat className="text-[#319694]" size={16} />
              <span className="text-gray-700 font-medium text-sm">Multiple Iterations</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Executing {iterations} simulation iteration{iterations > 1 ? 's' : ''}
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <Server className="text-[#319694]" size={16} />
              <div>
                <div className="font-medium text-gray-700">Hosts</div>
                <div className="text-gray-900 font-semibold">{numHosts}</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <Database className="text-[#319694]" size={16} />
              <div>
                <div className="font-medium text-gray-700">Tasks</div>
                <div className="text-gray-900 font-semibold">{numCloudlets}</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <HardDrive className="text-[#319694]" size={16} />
              <div>
                <div className="font-medium text-gray-700">VMs</div>
                <div className="text-gray-900 font-semibold">{numVMs}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CloudLoadingModal;