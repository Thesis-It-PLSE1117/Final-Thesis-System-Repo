import { useState } from 'react';
import HistoryCard from './HistoryCard';

const HistoryDropdown = ({ history, onSelect, selectedId }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Group history items by their base ID (without the suffix)
  const groupedHistory = history.reduce((groups, result) => {
    // Extract the base ID by removing the suffix after the last hyphen
    const baseId = result.id.replace(/-[a-z]+$/, '');
    
    if (!groups[baseId]) {
      groups[baseId] = [];
    }
    
    groups[baseId].push(result);
    return groups;
  }, {});

  return (
    <div className="relative">
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