import { motion } from "framer-motion";
import VMCard from "./VMCard";

export const VMCardsGrid = ({
  algorithm,
  dataCenterConfig,
  activeVMs,
  taskCounts,
  cpuLoads,
  getVmStatus,
  getStatusColor,
  isCompactView = false,
}) => {
  return (
    <div className={`grid gap-2 sm:gap-4 ${
      isCompactView 
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
    }`}>
      {Array.from({ length: dataCenterConfig.numVMs }).map((_, i) => (
        <motion.div
          key={`${algorithm}-${i}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{ duration: 0.3, delay: i * 0.02 }}
          whileHover={{ scale: 1.01 }}
        >
          <VMCard
            vmId={i}
            isActive={activeVMs[algorithm].includes(i)}
            taskCount={taskCounts[algorithm][i] || 0}
            cpuLoad={cpuLoads[algorithm][i] || 0}
            dataCenterConfig={dataCenterConfig}
            status={getVmStatus(i, algorithm)}
            getStatusColor={getStatusColor}
            isCompactView={isCompactView}
          />
        </motion.div>
      ))}
    </div>
  );
};