import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const AlgorithmTabs = ({ activeAlgorithm, setActiveAlgorithm }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const tabs = [
    {
      id: 'EPSO',
      label: 'Enhanced PSO',
      shortLabel: 'EPSO',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      color: 'blue'
    },
    {
      id: 'EACO',
      label: 'Enhanced ACO',
      shortLabel: 'EACO',
      icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
      color: 'purple'
    },
    {
      id: 'comparison',
      label: 'Comparison',
      shortLabel: 'Compare',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      color: 'indigo'
    }
  ];

  const activeTab = tabs.find(tab => tab.id === activeAlgorithm);

  return (
    <div className="mb-4 sm:mb-6">
      {/* Mobile Dropdown */}
      <div className="block sm:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-full flex items-center justify-between p-3 rounded-lg bg-green-50 text-green-700 font-medium border border-green-200"
        >
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={activeTab.icon} />
            </svg>
            {activeTab.label}
          </div>
          <svg 
            className={`w-4 h-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`w-full text-left p-3 flex items-center ${activeAlgorithm === tab.id 
                    ? 'bg-green-100 text-green-700' 
                    : 'text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => {
                    setActiveAlgorithm(tab.id);
                    setIsMenuOpen(false);
                  }}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  {tab.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden sm:flex border-b border-green-200">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-4 py-3 font-medium text-sm rounded-t-lg transition-all flex-shrink-0 ${activeAlgorithm === tab.id 
              ? `text-green-600 border-b-2 border-green-600 bg-green-50` 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            onClick={() => setActiveAlgorithm(tab.id)}
          >
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              {tab.label}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default AlgorithmTabs;