import { motion } from "framer-motion";

const MetricsPanel = ({ metrics, color = "blue" }) => {
  // Log the available metrics
  console.log("Available metrics:", metrics);
  console.log("Metrics keys:", metrics ? Object.keys(metrics) : "No metrics provided");

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
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      accent: "text-green-600",
    },
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-700",
      accent: "text-orange-600",
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
    {
      key: "energyConsumption",
      label: "Energy Consumption",
      icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
      tooltip: "Total energy consumed by all VMs",
      unit: "kWh",
    },
    {
      key: "responseTime",
      label: "Response Time",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      tooltip: "Average response time for task execution",
      unit: "s",
    },
  ];

  // Log each metric value individually
  metricConfigs.forEach(config => {
    console.log(`${config.label}:`, metrics[config.key]);
  });

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
      
      {/* Responsive grid that fits the available container width */}
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
    className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
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
        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
          {metric.label}
        </span>
      </div>
    </div>
    <div className="flex items-baseline">
      <span className={`text-xl font-bold ${color.accent}`}>
        {value || "0.00"}
      </span>
      {metric.unit && (
        <span className="text-sm text-gray-500 ml-1">{metric.unit}</span>
      )}
    </div>
  </motion.div>
);

export default MetricsPanel;