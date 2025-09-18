import { useState } from 'react';
import HistoryCard from './HistoryCard';
import { Info } from 'lucide-react';

const HistoryDropdown = ({ history, onSelect, selectedId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLegend, setShowLegend] = useState(false);

  // Group history items by their base ID (without the suffix)
  const groupedHistory = history.reduce((groups, result) => {
    // Extract the base ID by splitting on the last hyphen
    const parts = result.id.split('-');
    const baseId = parts.slice(0, -1).join('-');
    
    if (!groups[baseId]) {
      groups[baseId] = [];
    }
    
    groups[baseId].push(result);
    return groups;
  }, {});

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">Result History</h3>
        <button 
          onClick={() => setShowLegend(!showLegend)}
          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <Info size={14} />
          {showLegend ? 'Hide Legend' : 'Show Legend'}
        </button>
      </div>
      
      {/* Legend */}
      {showLegend && (
        <div className="mb-3 p-3 bg-blue-50 rounded-lg text-xs text-gray-600">
          <div className="font-medium mb-1 flex items-center gap-1">
            <Info size={14} />
            Analysis Indicators:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>Plot Analysis</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Interpretations</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span>Statistical Tests</span>
            </div>
          </div>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-200 rounded-lg p-2 shadow-sm flex justify-between items-center hover:bg-gray-50 transition-colors text-sm"
      >
        <span className="font-medium text-gray-700">
          {selectedId ? `Run #${selectedId.replace(/-[a-z]+$/, '')}` : 'Select a result'}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {Object.entries(groupedHistory).map(([baseId, results]) => (
            <div key={baseId} className="border-b border-gray-100 last:border-b-0">
              <div className="px-3 py-1 bg-gray-50 text-xs font-medium text-gray-500 sticky top-0">
                Run #{baseId}
              </div>
              <div className="divide-y divide-gray-100">
                {results.map((result) => (
                  <HistoryCard 
                    key={result.id}
                    result={result}
                    isSelected={result.id === selectedId}
                    onClick={() => {
                      onSelect(result);
                      setIsOpen(false);
                    }}
                    compact={true}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryDropdown;