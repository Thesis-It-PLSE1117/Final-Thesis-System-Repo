import { motion } from 'framer-motion';
import { Cpu, HardDrive, Wifi, Database } from 'lucide-react';

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

const inputVariants = {
  focus: {
    boxShadow: "0 0 0 2px rgba(49, 150, 148, 0.3)",
    borderColor: "#319694",
    transition: { duration: 0.2 }
  }
};

const ResourceRangeConfig = ({ ranges, onChange }) => {
  const resourceIcons = {
    cpu: <Cpu size={16} className="text-[#319694]" />,
    memory: <Database size={16} className="text-[#319694]" />,
    storage: <HardDrive size={16} className="text-[#319694]" />,
    bandwidth: <Wifi size={16} className="text-[#319694]" />
  };

  const resourceUnits = {
    cpu: 'cores',
    memory: 'GB',
    storage: 'MB',
    bandwidth: 'Mbps'
  };

  return (
    <motion.div 
      className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md border border-[#319694]/10 mt-6"
      variants={itemVariants}
      initial="hidden"
      animate="show"
      whileHover={{ 
        y: -3,
        boxShadow: "0 10px 25px -5px rgba(49, 150, 148, 0.1)",
        transition: { duration: 0.2 }
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#319694]/10 rounded-lg">
          <HardDrive className="text-[#319694]" size={20} />
        </div>
        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#267b79] to-[#4fd1c5]">
          Resource Ranges
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(ranges).map(([resource, range], index) => (
          <motion.div 
            key={resource}
            variants={itemVariants}
            transition={{ delay: index * 0.1 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              {resourceIcons[resource]}
              {resource} Range ({resourceUnits[resource]})
            </label>
            <div className="flex gap-3">
              <motion.input
                type="number"
                step={resource === 'cpu' ? '0.1' : '1'}
                min="0"
                value={range[0]}
                onChange={e => {
                  const newRange = [...range];
                  newRange[0] = parseFloat(e.target.value);
                  onChange(`resourceRanges.${resource}`, newRange);
                }}
                className="w-full px-4 py-2 border border-[#319694]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#319694]/30 focus:border-[#319694]/50 transition-all"
                whileFocus="focus"
                variants={inputVariants}
                placeholder="Min"
              />
              <motion.input
                type="number"
                step={resource === 'cpu' ? '0.1' : '1'}
                min={range[0] || 0}
                value={range[1]}
                onChange={e => {
                  const newRange = [...range];
                  newRange[1] = parseFloat(e.target.value);
                  onChange(`resourceRanges.${resource}`, newRange);
                }}
                className="w-full px-4 py-2 border border-[#319694]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#319694]/30 focus:border-[#319694]/50 transition-all"
                whileFocus="focus"
                variants={inputVariants}
                placeholder="Max"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ResourceRangeConfig;