import { motion } from 'framer-motion';
import { Cloud, HardDrive, Cpu, Network, Database, Server } from 'lucide-react';

const CloudLoadingModal = ({ numCloudlets, numHosts, numVMs, progress }) => {
  // Cloud animation variants
  const cloudVariants = {
    animate: {
      y: [0, -5, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Data packet animation variants
  const packetVariants = {
    animate: (i) => ({
      y: [0, 40],
      opacity: [1, 0],
      transition: {
        delay: i * 0.3,
        duration: 1.5,
        repeat: Infinity,
        ease: "easeIn"
      }
    })
  };

  // Cloud services with Lucide icons
  const cloudServices = [
    { name: "Compute", icon: <Cpu size={16} />, color: "#4CAF50" },
    { name: "Storage", icon: <HardDrive size={16} />, color: "#2196F3" },
    { name: "Network", icon: <Network size={16} />, color: "#9C27B0" },
    { name: "Database", icon: <Database size={16} />, color: "#FF9800" }
  ];

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
          <motion.div
            variants={cloudVariants}
            animate="animate"
            className="w-16 h-10 mr-3 flex items-center justify-center"
          >
            <Cloud size={32} className="text-blue-500" />
          </motion.div>
          <h3 id="cloud-loading-title" className="text-xl font-bold text-gray-800">
            Cloud Simulation Progress
          </h3>
        </div>

        {/* Cloud packets animation */}
        <div className="relative h-24 mb-6 overflow-hidden">
          <svg viewBox="0 0 100 60" className="w-full h-full">
            {[...Array(8)].map((_, i) => {
              const service = cloudServices[i % cloudServices.length];
              return (
                <motion.g
                  key={i}
                  custom={i}
                  variants={packetVariants}
                  animate="animate"
                  transform={`translate(${10 + (i * 10)}, 0)`}
                >
                  <rect 
                    x="0" y="0" 
                    width="8" height="8" 
                    rx="1" 
                    fill={service.color}
                    opacity="0.9"
                  />
                </motion.g>
              );
            })}
          </svg>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Initializing cloud resources...</span>
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