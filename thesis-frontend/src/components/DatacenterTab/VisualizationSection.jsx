import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, HardDriveUpload, HardDriveDownload } from 'lucide-react';

const VisualizationSection = ({ hostVisualization, vmCards, expandedSection, toggleSection }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-5 border border-[#319694]/15">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-[#319694]/10 rounded-lg mr-3">
          <HardDriveUpload className="text-[#319694]" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Load Balancing Visualization</h3>
          <p className="text-xs text-gray-600 mt-1">Preview task distribution across infrastructure</p>
        </div>
      </div>
      
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
          <div>
            <span className="font-medium">Task-to-VM Assignment</span>
            <p className="text-xs text-gray-500 mt-1">How cloudlets are distributed across virtual machines</p>
          </div>
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
          <div>
            <span className="font-medium">VM Resource Overview</span>
            <p className="text-xs text-gray-500 mt-1">Individual VM specifications and capacity</p>
          </div>
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