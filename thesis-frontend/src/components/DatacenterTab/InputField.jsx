import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';
import { useState, useRef } from 'react';

const ConfigRecommendations = {
  numHosts: "Recommended: 4-8 hosts (start small for testing)",
  numPesPerHost: "Recommended: 4-16 cores per host",
  peMips: "Recommended: 1000-3000 MIPS per core",
  ramPerHost: "Recommended: 8192-32768 MB (8GB-32GB)",
  bwPerHost: "Recommended: 10000-20000 MBps network bandwidth",
  storagePerHost: "Recommended: 1-2TB (1000000-2000000 MB)",
  numVMs: "Recommended: 10-50 VMs (should exceed host count)",
  vmMips: "Recommended: 500-2000 MIPS (less than host PE MIPS)",
  vmPes: "Recommended: 1-4 virtual CPUs per VM",
  vmRam: "Recommended: 512-4096 MB memory per VM",
  vmBw: "Recommended: 1000-5000 MBps bandwidth per VM",
  vmSize: "Recommended: 10-50GB (10000-50000 MB) storage per VM"
};

const InputField = ({ label, name, value, onChange, icon: Icon, unit, min = 1 }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef(null);

  return (
    <motion.div 
      className="mb-5 relative"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ 
        scale: 1.01,
        transition: { duration: 0.15 }
      }}
    >
      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
        {Icon && (
          <div className="p-1.5 mr-2 bg-[#319694]/10 rounded-md">
            <Icon className="text-[#319694]" size={16} />
          </div>
        )}
        <span className="text-gray-700">{label}</span>
      </label>
      
      <div className="relative">
        <motion.input
          ref={inputRef}
          type="number"
          name={name}
          value={value}
          onChange={onChange}
          className="w-full pl-10 pr-12 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#319694]/50 focus:border-[#319694]/30 transition-all duration-200 bg-white shadow-sm"
          min={min}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          whileFocus={{
            boxShadow: "0 0 0 3px rgba(49, 150, 148, 0.1)",
            borderColor: "#319694"
          }}
        />
        
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {Icon && <Icon className="text-gray-400" size={16} />}
        </div>
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {unit && (
            <span className="text-gray-500 text-sm font-medium mr-2">
              {unit}
            </span>
          )}
          <motion.div
            className="cursor-help"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div 
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative"
            >
              <Info 
                className="text-gray-400 hover:text-[#319694]" 
                size={16}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {(isFocused || isHovered) && (
          <motion.div
            className="absolute z-50 w-full mt-1 px-3 py-2 text-sm text-gray-700 bg-[#f8fafc] rounded-lg shadow-md border border-gray-200"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              left: 0,
              top: '100%'
            }}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5 mr-2 text-[#319694]">
                <Info size={14} />
              </div>
              <p className="text-[13px] leading-snug">
                {ConfigRecommendations[name]}
              </p>
            </div>
            <div className="absolute -top-1.5 left-4 w-3 h-3 bg-[#f8fafc] transform rotate-45 border-t border-l border-gray-200"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InputField;