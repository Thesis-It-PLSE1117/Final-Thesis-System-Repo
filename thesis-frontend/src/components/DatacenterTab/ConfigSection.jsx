import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ConfigSection = ({ title, icon: Icon, expanded, onToggle, children }) => (
  <motion.div 
    className="bg-gradient-to-br from-white to-[#f8fafc] p-6 rounded-2xl shadow-lg border border-[#e2e8f0] mb-6"
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ 
      duration: 0.3,
      type: 'spring',
      stiffness: 100
    }}
    whileHover={{
      boxShadow: '0 10px 15px -3px rgba(49, 150, 148, 0.1)'
    }}
  >
    <motion.div 
      className="flex justify-between items-center cursor-pointer"
      onClick={onToggle}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center">
        <div className="p-2 bg-[#319694]/10 rounded-lg mr-3">
          <Icon className="text-[#319694]" size={22} />
        </div>
        <h3 className="text-xl font-bold text-gray-800">
          {title}
        </h3>
      </div>
      <motion.div
        animate={{ rotate: expanded ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {expanded ? (
          <ChevronUp className="text-[#319694]" size={24} />
        ) : (
          <ChevronDown className="text-[#319694]" size={24} />
        )}
      </motion.div>
    </motion.div>
    
    <AnimatePresence>
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: 1, 
            height: 'auto',
            transition: { 
              opacity: { duration: 0.2 },
              height: { duration: 0.3 }
            }
          }}
          exit={{ 
            opacity: 0, 
            height: 0,
            transition: { 
              opacity: { duration: 0.15 },
              height: { duration: 0.25 }
            }
          }}
          className="overflow-hidden"
        >
          <div className="pt-4">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export default ConfigSection;