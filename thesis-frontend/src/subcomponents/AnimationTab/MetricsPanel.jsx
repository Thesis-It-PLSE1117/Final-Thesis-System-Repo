const MetricsPanel = ({ metrics, title, color = 'green' }) => (
  <div className="mt-6">
    {title && <h3 className={`text-lg font-bold text-${color}-700 mb-3`}>{title}</h3>}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard 
        title="Load Imbalance (σ)" 
        value={metrics.imbalance} 
        subtitle="Standard deviation of loads (lower is better)" 
      />
      <MetricCard 
        title="Makespan" 
        value={metrics.makespan} 
        subtitle="Maximum load on any VM" 
      />
      <MetricCard 
        title="Utilization" 
        value={`${metrics.utilization}%`} 
        subtitle="How well resources are balanced" 
      />
    </div>
  </div>
);

const MetricCard = ({ title, value, subtitle }) => (
  <div className="bg-gray-50 p-4 rounded-lg border border-green-200">
    <h4 className="text-sm font-medium text-gray-700 mb-1">{title}</h4>
    <div className="text-2xl font-bold text-gray-800">{value}</div>
    <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
  </div>
);

export default MetricsPanel;