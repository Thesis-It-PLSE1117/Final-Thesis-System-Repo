import { motion } from "framer-motion";

const MetricsPanel = ({ metrics, color = "blue" }) => {
  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      accent: "text-blue-600",
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-700",
      accent: "text-purple-600",
    },
  };

  const currentColor = colorClasses[color] || colorClasses.blue;

  const metricConfigs = [
    {
      key: "imbalance",
      label: "Load Imbalance",
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      tooltip: "Measure of how evenly tasks are distributed across VMs",
    },
    {
      key: "makespan",
      label: "Makespan",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      tooltip: "Total time taken to complete all tasks",
      unit: "s",
    },
    {
      key: "utilization",
      label: "Resource Utilization",
      icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z",
      tooltip: "Percentage of available resources being used",
      unit: "%",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${currentColor.bg} ${currentColor.border} border rounded-xl p-4 sm:p-6`}
    >
      <h4 className={`font-semibold text-lg mb-4 ${currentColor.accent} flex items-center`}>
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        Performance Metrics
      </h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {metricConfigs.map((metric, index) => (
          <MetricCard
            key={metric.key}
            metric={metric}
            value={metrics[metric.key]}
            color={currentColor}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
};

const MetricCard = ({ metric, value, color, index }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.1 }}
    className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-100"
  >
    <div className="flex items-start justify-between mb-2">
      <div className="flex items-center">
        <svg
          className={`w-4 h-4 mr-2 ${color.text}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={metric.icon}
          />
        </svg>
        <span className="text-sm font-medium text-gray-700">{metric.label}</span>
      </div>
    </div>
    <div className="flex items-baseline">
      <span className={`text-xl font-bold ${color.accent}`}>
        {value}
      </span>
      {metric.unit && (
        <span className="text-sm text-gray-500 ml-1">{metric.unit}</span>
      )}
    </div>
  </motion.div>
);

export default MetricsPanel;