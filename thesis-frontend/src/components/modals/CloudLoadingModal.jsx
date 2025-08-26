import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, HardDrive, Cpu, Network, Database, Server, Clock, Activity, Info, Repeat } from 'lucide-react';

const CloudLoadingModal = ({ numCloudlets, numHosts, numVMs, progress, iterations = 1 }) => {
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
    if (progress === 0 || elapsedTime === 0) return 'Calculating...';
    const estimatedTotal = (elapsedTime / progress) * 100;
    const remaining = Math.max(0, estimatedTotal - elapsedTime);
    return `~${formatTime(Math.round(remaining))} remaining`;
  };
  
  const tips = [
    "EPSO enhances traditional PSO by using adaptive inertia weights that decrease from 0.9 to 0.4 during optimization.",
    "EACO improves upon standard ACO by incorporating dynamic pheromone evaporation rates based on solution quality.",
    "Your multi-objective fitness function balances makespan (25%), cost (25%), energy (25%), and load balance (25%).",
    "The load balance metric uses standard deviation of VM utilization - lower values indicate better distribution.",
    "EPSO's cognitive (c1=2.0) and social (c2=2.0) factors guide particles toward personal and global best solutions.",
    "EACO uses alpha=1.0 for pheromone influence and beta=2.0 for heuristic information in probability calculations.",
    "Both algorithms run for 50 iterations with population sizes optimized for convergence speed vs solution quality.",
    "Energy consumption is calculated using VM power models: 120W at peak + 60% at idle state.",
    "The simulation uses CloudSim 7.0's enhanced architecture for more accurate cloud environment modeling.",
    "MATLAB integration provides 3D surface plots, convergence graphs, and comparative performance visualizations."
  ];
  
  const [currentTipIndex, setCurrentTipIndex] = React.useState(0);
  
  React.useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTipIndex(prev => (prev + 1) % tips.length);
    }, 10000); // 10 secs
    
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
        {/* Cloud header */}
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-10 mr-3 flex items-center justify-center">
            <Cloud size={32} className="text-blue-500" />
          </div>
          <h3 id="cloud-loading-title" className="text-xl font-bold text-gray-800">
            Cloud Simulation Progress
          </h3>
        </div>

        {/* Loading GIF animation */}
        <div className="flex justify-center mb-6">
          <img 
            src="/loading/cloud_loading.gif" 
            alt="Cloud simulation in progress"
            className="h-36 w-auto"
          />
        </div>

        {/* Enhanced Progress Information */}
        <div className="mb-4">
          {/* Time information */}
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={14} />
              <span>Elapsed: {formatTime(elapsedTime)}</span>
            </div>
            
          </div>
          
          {/* Progress bar */}
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Overall Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div
              className="h-2.5 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-amber-100 rounded">
              <Info className="text-amber-800" size={16} />
            </div>
            <span className="text-amber-800 font-medium text-sm">Did You Know?</span>
          </div>
          <motion.p 
            key={currentTipIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.5 }}
            className="text-xs text-amber-700 leading-relaxed"
          >
            {tips[currentTipIndex]}
          </motion.p>
        </div>
        
        {/*running multiple */}
        {iterations > 1 && (
          <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-100 rounded">
                <Repeat className="text-purple-800" size={16} />
              </div>
              <span className="text-purple-800 font-medium text-sm">Running Multiple Iterations</span>
            </div>
            <p className="text-xs text-purple-700 mt-1">
              Executing {iterations} simulation run{iterations > 1 ? 's' : ''}
            </p>
          </div>
        )}
        
        {/* Resource allocation info */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="bg-blue-50 p-2 rounded-lg flex items-center gap-2">
            <Server className="text-blue-500" size={16} />
            <div>
              <div className="font-medium text-blue-800">Hosts</div>
              <div className="text-blue-600">{numHosts}</div>
            </div>
          </div>
          <div className="bg-green-50 p-2 rounded-lg flex items-center gap-2">
            <Cpu className="text-green-500" size={16} />
            <div>
              <div className="font-medium text-green-800">Cloudlets</div>
              <div className="text-green-600">{numCloudlets}</div>
            </div>
          </div>
          <div className="bg-amber-50 p-2 rounded-lg flex items-center gap-2">
            <HardDrive className="text-amber-500" size={16} />
            <div>
              <div className="font-medium text-amber-800">VMs</div>
              <div className="text-amber-600">{numVMs}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CloudLoadingModal;