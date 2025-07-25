const MetricsPanel = ({ metrics, color = "blue" }) => {
  const colorClass = color === "blue" ? "text-blue-600" : "text-purple-600";
  
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <MetricCard 
        title="Degree of Imbalance" 
        value={`${metrics.imbalance}%`} 
        subtitle="Measure of load imbalance (0% = perfect balance)" 
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
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
    <h4 className={`text-sm font-medium ${colorClass} mb-1`}>{title}</h4>
    <div className="text-2xl font-bold text-gray-800">{value}</div>
    <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
  </div>
);
  
export default MetricsPanel;
  