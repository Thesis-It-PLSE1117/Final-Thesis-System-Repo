import { BarChart2, Clock, Cpu, Zap, Activity, TrendingUp, Award, Eye, FileText } from 'lucide-react';

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
      
      {/* Plot Analysis Section */}
      {result.plotAnalysis && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
            <TrendingUp size={16} className="text-[#319694]" />
            Plot Analysis Summary
          </h4>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                  <BarChart2 size={14} />
                  Plots Generated
                </div>
                <p className="font-semibold text-lg text-gray-800">
                  {result.plotAnalysis.hasPlots ? 'Yes' : 'No'}
                </p>
                <p className="text-xs text-gray-500">
                  {result.plotAnalysis.plotCount || 0} plots
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                  <FileText size={14} />
                  Plot Types
                </div>
                <p className="font-semibold text-sm text-gray-800">
                  {result.plotAnalysis.plotTypes ? result.plotAnalysis.plotTypes.length : 0}
                </p>
                <p className="text-xs text-gray-500">
                  visualization types
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                  <Eye size={14} />
                  Interpretations
                </div>
                <p className="font-semibold text-sm text-gray-800">
                  {result.plotAnalysis.plotMetadata && 
                   result.plotAnalysis.plotMetadata.some(p => p.interpretation) ? 'Available' : 'None'}
                </p>
                <p className="text-xs text-gray-500">
                  analysis ready
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                  <Award size={14} />
                  Backend Analysis
                </div>
                <p className="font-semibold text-sm text-gray-800">
                  {result.plotAnalysis.analysis ? 'Available' : 'None'}
                </p>
                <p className="text-xs text-gray-500">
                  insights included
                </p>
              </div>
            </div>
            
            {/* Show plot types if available */}
            {result.plotAnalysis.plotTypes && result.plotAnalysis.plotTypes.length > 0 && (
              <div className="border-t border-blue-200 pt-3">
                <p className="text-sm text-gray-600 mb-2">Available Visualizations:</p>
                <div className="flex flex-wrap gap-2">
                  {result.plotAnalysis.plotTypes.map((type, index) => (
                    <span key={index} className="bg-white px-2 py-1 rounded-md text-xs font-medium text-gray-700 border border-blue-200">
                      {type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Statistical Analysis Section */}
      {result.tTestResults && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Award size={16} className="text-[#319694]" />
            Statistical Analysis
          </h4>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Overall Winner</p>
                <p className="font-semibold text-lg text-gray-800">
                  {result.tTestResults.overallWinner || 'No clear winner'}
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">Significant Differences</p>
                <p className="font-semibold text-lg text-gray-800">
                  {result.tTestResults.significantDifferences || 0} / {Object.keys(result.tTestResults.metricTests || {}).length || 5}
                </p>
                <p className="text-xs text-gray-500">metrics</p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">Sample Size</p>
                <p className="font-semibold text-lg text-gray-800">
                  {result.tTestResults.sampleSize || 'N/A'}
                </p>
                <p className="text-xs text-gray-500">iterations</p>
              </div>
            </div>
            
            {/* Show interpretation if available */}
            {result.tTestResults.interpretation && (
              <div className="border-t border-green-200 pt-3 mt-3">
                <p className="text-sm text-gray-600 mb-2">Statistical Interpretation:</p>
                <div className="bg-white rounded-md p-3 text-sm text-gray-700">
                  {typeof result.tTestResults.interpretation === 'object' 
                    ? JSON.stringify(result.tTestResults.interpretation, null, 2)
                    : result.tTestResults.interpretation
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
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