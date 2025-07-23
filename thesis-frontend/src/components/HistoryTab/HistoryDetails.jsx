import { BarChart2, Clock, Cpu, Zap, Activity } from 'lucide-react';

const HistoryDetails = ({ result, onViewResults }) => {
  if (!result) return null;

  // Safely access properties with defaults
  const summary = result.summary || {};
  const config = result.config || {};
  
  const metrics = [
    {
      icon: <Clock size={20} className="text-[#319694]" />,
      title: "Makespan",
      value: (summary.makespan || 0).toFixed(2),
      unit: "ms"
    },
    {
      icon: <Cpu size={20} className="text-[#319694]" />,
      title: "Resource Utilization",
      value: (summary.resourceUtilization || summary.utilization || 0).toFixed(2),
      unit: "%"
    },
    {
      icon: <Zap size={20} className="text-[#319694]" />,
      title: "Energy Consumption",
      value: (typeof result.energyConsumption === 'number' 
        ? result.energyConsumption 
        : result.energyConsumption?.totalEnergyWh || 0
      ).toFixed(2),
      unit: "Wh"
    },
    {
      icon: <Activity size={20} className="text-[#319694]" />,
      title: "Load Balance",
      value: (summary.loadBalance || summary.imbalanceDegree || summary.imbalance || 0).toFixed(4),
      unit: ""
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Simulation Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4 flex items-center">
            <div className="bg-[#e0f7f6] p-2 rounded-full mr-4">
              {metric.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{metric.title}</p>
              <p className="text-xl font-semibold">
                {metric.value} <span className="text-sm font-normal">{metric.unit}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-2">Configuration</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Hosts</p>
            <p>{config.numHosts || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500">VMs</p>
            <p>{config.numVMs || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500">Cloudlets</p>
            <p>{config.numCloudlets || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500">Algorithm</p>
            <p>{result.algorithm || config.optimizationAlgorithm || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500">VM Scheduler</p>
            <p>{config.vmScheduler || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500">Workload</p>
            <p>{config.workloadType || 'N/A'}</p>
          </div>
        </div>
      </div>
      
      <button
        onClick={() => onViewResults(result)}
        className="bg-[#319694] text-white px-6 py-2 rounded-lg hover:bg-[#267b79] transition-colors flex items-center gap-2"
      >
        <BarChart2 size={18} />
        View Detailed Results
      </button>
    </div>
  );
};

export default HistoryDetails;