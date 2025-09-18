import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, HardDriveUpload, HardDriveDownload } from 'lucide-react';

const VisualizationSection = ({ hostVisualization, vmCards, expandedSection, toggleSection }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Visualization</h3>
      
      {/* Host-VM Distribution */}
      <div className="mb-6">
        <button 
          className="flex items-center w-full text-left mb-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection('distribution')}
        >
          {expandedSection.distribution ? (
            <ChevronDown className="mr-2" size={20} />
          ) : (
            <ChevronRight className="mr-2" size={20} />
          )}
          <HardDriveUpload className="mr-2" size={20} />
          <span className="font-medium">Host-VM Distribution</span>
        </button>
        
        <AnimatePresence>
          {expandedSection.distribution && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="overflow-y-auto pl-8" style={{ maxHeight: '400px' }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-1">
                  {hostVisualization}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Virtual Machines Preview */}
      <div>
        <button 
          className="flex items-center w-full text-left mb-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection('preview')}
        >
          {expandedSection.preview ? (
            <ChevronDown className="mr-2" size={20} />
          ) : (
            <ChevronRight className="mr-2" size={20} />
          )}
          <HardDriveDownload className="mr-2" size={20} />
          <span className="font-medium">Virtual Machines Preview</span>
        </button>
        
        <AnimatePresence>
          {expandedSection.preview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="overflow-y-auto pl-8" style={{ maxHeight: '400px' }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-1">
                  {vmCards}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VisualizationSection;