import { motion } from 'framer-motion';

const AlgorithmTabs = ({ activeAlgorithm, setActiveAlgorithm }) => {
  const tabs = [
    {
      id: 'EPSO',
      label: 'Enhanced PSO',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      color: 'blue'
    },
    {
      id: 'EACO',
      label: 'Enhanced ACO',
      icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
      color: 'purple'
    },
    {
      id: 'comparison',
      label: 'Comparison',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      color: 'indigo'
    }
  ];

  return (
    <div className="flex mb-6 border-b border-green-200">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-all ${activeAlgorithm === tab.id 
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
  );
};

export default AlgorithmTabs;