import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HistoryPlaceholder from './HistoryPlaceHolder';
import { exportSimulationHistory } from '../../utils/exportUtils';
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
        // Failed to parse history
      }
    }
  }, []);

  const handleSelectResult = (result) => {
    setSelectedResult(result);
  };

  const handleDownloadCSV = () => {
    // Export only the selected result, or the first one if none selected
    const dataToExport = selectedResult ? [selectedResult] : (history.length > 0 ? [history[0]] : []);
    if (dataToExport.length === 0) {
      alert('No simulation data to export');
      return;
    }
    exportSimulationHistory(dataToExport, 'csv');
  };

  const handleDownloadJSON = () => {
    // Export only the selected result, or the first one if none selected
    const dataToExport = selectedResult ? [selectedResult] : (history.length > 0 ? [history[0]] : []);
    if (dataToExport.length === 0) {
      alert('No simulation data to export');
      return;
    }
    exportSimulationHistory(dataToExport, 'json');
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {history.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleDownloadCSV}
              className="bg-[#319694] text-white px-4 py-2 rounded-lg hover:bg-[#267b79] transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              CSV
            </button>
            <button
              onClick={handleDownloadJSON}
              className="bg-[#319694] text-white px-4 py-2 rounded-lg hover:bg-[#267b79] transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              JSON
            </button>
            <button
              onClick={handleClearHistory}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear History
            </button>
          </div>
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