import { Search } from 'lucide-react';

const HistoryCard = ({ result, isSelected, onClick }) => {
  const date = new Date(result.timestamp);
  const formattedDate = date.toLocaleString();
  
  const makespan = result.summary?.makespan || 0;
  const config = result.config || {};
  
  const hasPlotAnalysis = result.plotAnalysis?.hasPlots;
  const hasInterpretations = result.plotAnalysis?.plotMetadata?.some(p => p.interpretation);
  const hasStatisticalAnalysis = result.tTestResults;
  const hasBackendAnalysis = result.plotAnalysis?.analysis;
  
  return (
    <div
      onClick={onClick}
      className={`p-4 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors ${
        isSelected ? 'bg-[#e0f7f6]' : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-gray-800">
            {result.algorithm || 'Run'} #{result.id}
          </h4>
          
          <div className="flex gap-1">
            {hasPlotAnalysis && (
              <div className="w-2 h-2 bg-blue-500 rounded-full" title="Plots available" />
            )}
            {hasInterpretations && (
              <div className="w-2 h-2 bg-green-500 rounded-full" title="Interpretations available" />
            )}
            {hasStatisticalAnalysis && (
              <div className="w-2 h-2 bg-purple-500 rounded-full" title="Statistical analysis available" />
            )}
            {hasBackendAnalysis && (
              <div className="w-2 h-2 bg-orange-500 rounded-full" title="Backend analysis available" />
            )}
          </div>
        </div>
        <span className="text-xs text-gray-500">{formattedDate}</span>
      </div>
      
      <div className="mt-2 flex justify-between text-sm">
        <span className="text-gray-600">
          {config.numHosts || 0} Hosts, {config.numVMs || 0} VMs
        </span>
        <span className="font-medium text-[#319694]">
          {makespan > 0 ? `${makespan.toFixed(2)} ms` : 'N/A'}
        </span>
      </div>
      
      {(hasPlotAnalysis || hasInterpretations || hasStatisticalAnalysis || hasBackendAnalysis) && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="flex flex-wrap gap-2 text-xs">
            {hasPlotAnalysis && (
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                 {result.plotAnalysis.plotCount} plots
              </span>
            )}
            {hasInterpretations && (
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded flex items-center gap-1">
                <Search size={12} /> Interpretations
              </span>
            )}
            {hasStatisticalAnalysis && (
              <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                 T-Test
              </span>
            )}
            {hasBackendAnalysis && (
              <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">
                 AI Analysis
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryCard;