import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';

const ConfigurationPanel = ({ title, icon: Icon, expanded, toggleSection, children }) => {
  return (
    <div className="mb-6">
      <button 
        className="flex items-center w-full text-left mb-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
        onClick={toggleSection}
      >
        {expanded ? (
          <ChevronDown className="mr-2" size={20} />
        ) : (
          <ChevronRight className="mr-2" size={20} />
        )}
        <Icon className="mr-2" size={20} />
        <span className="font-medium">{title}</span>
      </button>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConfigurationPanel;