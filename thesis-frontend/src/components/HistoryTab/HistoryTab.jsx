import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HistoryPlaceholder from './HistoryPlaceholder';
import HistoryDropdown from './HistoryDropdown';
import HistoryDetails from './HistoryDetails';

const HistoryTab = ({ onBack, onViewResults }) => {
  const [history, setHistory] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('simulationHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  const handleSelectResult = (result) => {
    setSelectedResult(result);
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      localStorage.removeItem('simulationHistory');
      setHistory([]);
      setSelectedResult(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="bg-[#319694] text-white px-4 py-2 rounded-lg hover:bg-[#267b79] transition-colors"
        >
          Back
        </button>
        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <HistoryPlaceholder />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <HistoryDropdown 
              history={history} 
              onSelect={handleSelectResult}
              selectedId={selectedResult?.id}
            />
          </div>
          <div className="lg:col-span-2">
            <HistoryDetails 
              result={selectedResult || history[0]} 
              onViewResults={onViewResults}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default HistoryTab;