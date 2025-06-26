import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock } from 'lucide-react';
import WorkloadModelSelector from './WorkloadModelSelector';
import ResourceRangeConfig from './ResourceRangeConfig';

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.4,
      ease: "easeOut"
    } 
  }
};

const SyntheticWorkloadPanel = ({ onSubmit }) => {
  const [config, setConfig] = useState({
    jobCount: 100,
    timeRange: 86400,
    modelType: 'google-like',
    resourceRanges: {
      cpu: [0.1, 4],
      memory: [0.1, 16],
      storage: [0, 100],
      bandwidth: [0, 1000]
    }
  });

  const handleConfigChange = (path, value) => {
    const pathParts = path.split('.');
    setConfig(prev => {
      const newConfig = { ...prev };
      let current = newConfig;
      
      for (let i = 0; i < pathParts.length - 1; i++) {
        current = current[pathParts[i]] = { ...current[pathParts[i]] };
      }
      
      current[pathParts[pathParts.length - 1]] = value;
      return newConfig;
    });
  };

  const handleSubmit = () => {
    onSubmit(config);
  };

  return (
    <motion.div 
      className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md border border-[#319694]/10"
      variants={itemVariants}
      initial="hidden"
      animate="show"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#319694]/10 rounded-lg">
          <Zap className="text-[#319694]" size={20} />
        </div>
        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#267b79] to-[#4fd1c5]">
          Synthetic Workload Configuration
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Zap size={16} className="text-[#319694]" />
            Number of Jobs
          </label>
          <motion.input
            type="number"
            min="1"
            value={config.jobCount}
            onChange={e => handleConfigChange('jobCount', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-[#319694]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#319694]/30 focus:border-[#319694]/50 transition-all"
            whileFocus={{
              boxShadow: "0 0 0 2px rgba(49, 150, 148, 0.3)",
              borderColor: "#319694",
            }}
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Clock size={16} className="text-[#319694]" />
            Time Range (seconds)
          </label>
          <motion.input
            type="number"
            min="1"
            value={config.timeRange}
            onChange={e => handleConfigChange('timeRange', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-[#319694]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#319694]/30 focus:border-[#319694]/50 transition-all"
            whileFocus={{
              boxShadow: "0 0 0 2px rgba(49, 150, 148, 0.3)",
              borderColor: "#319694",
            }}
          />
        </motion.div>
      </div>
      
      <WorkloadModelSelector 
        modelType={config.modelType}
        onChange={handleConfigChange}
      />
      
      <ResourceRangeConfig 
        ranges={config.resourceRanges}
        onChange={handleConfigChange}
      />
      
      <motion.button
        onClick={handleSubmit}
        className="mt-6 w-full bg-gradient-to-r from-[#319694] to-[#4fd1c5] text-white py-3 px-6 rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 10px 25px -5px rgba(49, 150, 148, 0.4)",
        }}
        whileTap={{ scale: 0.98 }}
      >
        Generate Synthetic Workload
      </motion.button>
    </motion.div>
  );
};

export default SyntheticWorkloadPanel;