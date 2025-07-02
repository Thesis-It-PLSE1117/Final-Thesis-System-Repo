import { useState } from 'react';
import HistoryCard from './HistoryCard';

const HistoryDropdown = ({ history, onSelect, selectedId }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex justify-between items-center hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-700">
          {selectedId ? `Run #${selectedId}` : 'Select a result'}
        </span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {history.map((result) => (
            <HistoryCard 
              key={result.id}
              result={result}
              isSelected={result.id === selectedId}
              onClick={() => {
                onSelect(result);
                setIsOpen(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryDropdown;