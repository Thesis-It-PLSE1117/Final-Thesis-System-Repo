import { motion } from 'framer-motion';
import VMCard from './VMCard';

const AlgorithmView = ({ 
  algorithm, 
  activeVMs, 
  taskCounts, 
  cpuLoads, 
  dataCenterConfig, 
  highlightedVM,
  getVmStatus,
  getStatusColor
}) => {
  const renderVMCards = () => {
    return Array.from({ length: dataCenterConfig.numVMs }).map((_, i) => (
      <motion.div
        key={`${algorithm.id}-${i}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          scale: highlightedVM[algorithm.id] === i ? 1.03 : 1,
          boxShadow: highlightedVM[algorithm.id] === i ? 
            '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : 'none'
        }}
        transition={{ 
          duration: 0.3, 
          delay: i * 0.05,
          scale: { type: 'spring', stiffness: 300, damping: 20 }
        }}
        whileHover={{ scale: 1.02 }}
      >
        <VMCard
          vmId={i}
          isActive={activeVMs[algorithm.id].includes(i)}
          isHighlighted={highlightedVM[algorithm.id] === i}
          taskCount={taskCounts[algorithm.id][i] || 0}
          cpuLoad={cpuLoads[algorithm.id][i] || 0}
          dataCenterConfig={dataCenterConfig}
          status={getVmStatus(i, algorithm.id)}
          getStatusColor={getStatusColor}
        />
      </motion.div>
    ));
  };

  return (
    <motion.div 
      className="bg-white p-6 rounded-xl shadow-sm border border-green-200"
      initial={{ opacity: 0, x: algorithm.initialX }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        boxShadow: `0 10px 15px -3px rgba(${algorithm.rgb}, 0.1), 0 4px 6px -2px rgba(${algorithm.rgb}, 0.05)`
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h5 className={`font-bold text-lg text-${algorithm.color}-600 flex items-center`}>
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={algorithm.icon} 
            />
          </svg>
          {algorithm.label}
        </h5>
        <span className={`text-xs bg-${algorithm.color}-600 text-white px-2 py-1 rounded-full`}>
          {activeVMs[algorithm.id].length} Active VMs
        </span>
      </div>
      
      <div className="h-[400px] overflow-y-auto smooth-scroll pr-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {renderVMCards()}
        </div>
      </div>
    </motion.div>
  );
};

export default AlgorithmView;