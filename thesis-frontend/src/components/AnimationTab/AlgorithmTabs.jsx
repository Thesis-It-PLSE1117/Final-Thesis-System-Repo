import { motion } from "framer-motion";

export const AlgorithmTabs = ({ activeAlgorithm, setActiveAlgorithm }) => {
  const tabs = [
    { id: "EPSO", label: "EPSO", icon: "M13 10V3L4 14h7v7l9-11h-7z", color: "blue" },
    { id: "EACO", label: "EACO", icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4", color: "purple" },
    { id: "PSO", label: "PSO", icon: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8", color: "green" },
    { id: "ACO", label: "ACO", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z", color: "orange" },
    { id: "comparison", label: "Compare", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", color: "indigo" },
  ];

  return (
    <div className="flex mb-4 sm:mb-6 border-b border-gray-200 overflow-x-auto">
      <div className="flex min-w-full sm:min-w-0 sm:w-full">
        {tabs.map((tab) => (
          <AlgorithmTab
            key={tab.id}
            tab={tab}
            isActive={activeAlgorithm === tab.id}
            onClick={() => setActiveAlgorithm(tab.id)}
          />
        ))}
      </div>
    </div>
  );
};

const AlgorithmTab = ({ tab, isActive, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`flex-1 sm:flex-none px-2 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm rounded-t-lg transition-all ${
      isActive
        ? `text-${tab.color}-600 border-b-2 border-${tab.color}-600 bg-${tab.color}-50`
        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
    }`}
    onClick={onClick}
  >
    <div className="flex items-center justify-center">
      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
      </svg>
      <span className="whitespace-nowrap">{tab.label}</span>
    </div>
  </motion.button>
);