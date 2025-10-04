const MetricsPanel = ({ metrics, color = "blue" }) => {
  const colorClass = color === "blue" ? "text-blue-600" : "text-purple-600";
  
  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 mb-4 px-2 sm:px-0">
      <MetricCard 
        title="Degree of Imbalance" 
        value={metrics.imbalance} 
        subtitle="DI = (MaxTime - MinTime) / AvgTime (lower)" 
        colorClass={colorClass}
      />
      <MetricCard 
        title="Makespan" 
        value={metrics.makespan} 
        subtitle="Maximum completion time across all VMs" 
        colorClass={colorClass}
      />
      <MetricCard 
        title="Utilization" 
        value={`${metrics.utilization}%`} 
        subtitle="How well resources are balanced" 
        colorClass={colorClass}
      />
    </div>
  );
};
  
const MetricCard = ({ title, value, subtitle, colorClass }) => (
  <div className="bg-gray-50 p-3 sm:p-4 md:p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
    <h4 className={`text-xs sm:text-sm font-medium ${colorClass} mb-1 sm:mb-2`}>{title}</h4>
    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">{value}</div>
    <div className="text-xs text-gray-500 mt-auto leading-tight">{subtitle}</div>
  </div>
);
  
export default MetricsPanel;