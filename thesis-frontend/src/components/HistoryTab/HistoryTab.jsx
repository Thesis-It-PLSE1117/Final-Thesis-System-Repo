import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getHistory, 
  clearHistory, 
  deleteHistoryEntry, 
  getHistoryStats,
  searchHistory,
  exportHistory,
  importHistory
} from '../../services/historyService';
import HistoryPlaceholder from './HistoryPlaceHolder';
import { exportSimulationHistory } from '../../utils/exportUtils';
import HistoryDropdown from './HistoryDropdown';
import HistoryDetails from './HistoryDetails';

const HistoryTab = ({ onBack, onViewResults }) => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [historyStats, setHistoryStats] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAlgorithm, setFilterAlgorithm] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

  // Load history and stats on component mount
  useEffect(() => {
    loadHistory();
    loadHistoryStats();
  }, []);

  // Filter and search history whenever filters change
  useEffect(() => {
    filterAndSearchHistory();
  }, [history, searchTerm, filterAlgorithm, sortBy]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const historyData = await getHistory();
      setHistory(historyData);
    } catch (err) {
      setError('Failed to load simulation history');
      console.error('Error loading history:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadHistoryStats = async () => {
    try {
      const stats = await getHistoryStats();
      setHistoryStats(stats);
    } catch (err) {
      console.error('Error loading history stats:', err);
    }
  };

  const filterAndSearchHistory = () => {
    let filtered = [...history];

    // Filter by algorithm
    if (filterAlgorithm !== 'all') {
      filtered = filtered.filter(item => item.algorithm === filterAlgorithm);
    }

    // Search by various fields
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.algorithm.toLowerCase().includes(searchLower) ||
        item.simulationId?.toLowerCase().includes(searchLower) ||
        new Date(item.timestamp).toLocaleDateString().includes(searchLower) ||
        item.config?.workloadType?.toLowerCase().includes(searchLower)
      );
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.timestamp) - new Date(b.timestamp);
        case 'newest':
        default:
          return new Date(b.timestamp) - new Date(a.timestamp);
      }
    });

    setFilteredHistory(filtered);
  };

  const handleSelectResult = (result) => {
    setSelectedResult(result);
  };

  const handleDeleteEntry = async (resultId) => {
    try {
      const success = await deleteHistoryEntry(resultId);
      if (success) {
        await loadHistory();
        await loadHistoryStats();
        if (selectedResult && selectedResult.id.startsWith(resultId.split('-')[0])) {
          setSelectedResult(null);
        }
        setShowDeleteConfirm(null);
      } else {
        alert('Failed to delete history entry');
      }
    } catch (err) {
      console.error('Error deleting history entry:', err);
      alert('Error deleting history entry');
    }
  };

  const handleExportSelected = (format) => {
    const dataToExport = selectedResult ? [selectedResult] : (filteredHistory.length > 0 ? [filteredHistory[0]] : []);
    if (dataToExport.length === 0) {
      alert('No simulation data to export');
      return;
    }
    exportSimulationHistory(dataToExport, format);
  };

  const handleExportAll = async () => {
    try {
      setIsExporting(true);
      const backupData = await exportHistory();
      if (backupData) {
        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `simulation-history-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        alert('Failed to export history');
      }
    } catch (err) {
      console.error('Error exporting history:', err);
      alert('Error exporting history');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportHistory = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const backupData = JSON.parse(text);
      
      if (window.confirm('This will replace all existing history. Continue?')) {
        const success = await importHistory(backupData);
        if (success) {
          await loadHistory();
          await loadHistoryStats();
          setSelectedResult(null);
          alert('History imported successfully');
        } else {
          alert('Failed to import history');
        }
      }
    } catch (err) {
      console.error('Error importing history:', err);
      alert('Invalid backup file format');
    }
    
    // Reset file input
    event.target.value = '';
    setShowImportDialog(false);
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all history? This cannot be undone.')) {
      try {
        const success = await clearHistory();
        if (success) {
          setHistory([]);
          setFilteredHistory([]);
          setSelectedResult(null);
          await loadHistoryStats();
        } else {
          alert('Failed to clear history');
        }
      } catch (err) {
        console.error('Error clearing history:', err);
        alert('Error clearing history');
      }
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterAlgorithm('all');
    setSortBy('newest');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#319694]"></div>
        <span className="ml-3 text-gray-600">Loading simulation history...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
        <button 
          onClick={loadHistory}
          className="bg-[#319694] text-white px-4 py-2 rounded-lg hover:bg-[#267b79] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      {/* Header with Stats and Actions */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Simulation History</h2>
            <div className="text-sm text-gray-600">
              <span className="font-medium text-[#319694]">{historyStats.simulationRuns || 0}</span> simulation runs • 
              <span className="font-medium text-[#319694] ml-1">{historyStats.totalEntries || 0}</span> total entries
            </div>
            {historyStats.totalEntries > 0 && (
              <div className="text-xs text-gray-500 mt-1">
                Storage: {historyStats.totalEntries}/{historyStats.maxEntries} entries
              </div>
            )}
          </div>
          
          {history.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleExportSelected('csv')}
                disabled={!selectedResult}
                className="bg-white text-gray-700 px-3 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
                title="Export selected as CSV"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export
              </button>
              
              <button
                onClick={handleExportAll}
                disabled={isExporting}
                className="bg-white text-gray-700 px-3 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 flex items-center transition-colors"
                title="Backup all history"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {isExporting ? 'Exporting...' : 'Backup'}
              </button>
              
              <button
                onClick={() => setShowImportDialog(true)}
                className="bg-white text-gray-700 px-3 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 flex items-center transition-colors"
                title="Import history from backup"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Import
              </button>
              
              <button
                onClick={handleClearHistory}
                className="bg-white text-red-500 px-3 py-2 rounded-lg text-sm border border-red-100 hover:bg-red-50 flex items-center transition-colors"
                title="Clear all history"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {history.length === 0 ? (
        <HistoryPlaceholder />
      ) : (
        <>
          {/* Search and Filter Controls */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Filter Simulations</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2 font-medium">Search</label>
                <input
                  type="text"
                  placeholder="Search simulations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 rounded-lg focus:ring-2 focus:ring-[#319694] focus:border-transparent text-sm transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-2 font-medium">Algorithm</label>
                <select
                  value={filterAlgorithm}
                  onChange={(e) => setFilterAlgorithm(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 rounded-lg focus:ring-2 focus:ring-[#319694] focus:border-transparent text-sm transition-colors"
                >
                  <option value="all">All Algorithms</option>
                  <option value="EACO">EACO</option>
                  <option value="EPSO">EPSO</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-2 font-medium">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 rounded-lg focus:ring-2 focus:ring-[#319694] focus:border-transparent text-sm transition-colors"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
            
            {(searchTerm || filterAlgorithm !== 'all') && (
              <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600 flex justify-between items-center">
                <span>Showing {filteredHistory.length} of {history.length} entries</span>
                <button
                  onClick={resetFilters}
                  className="text-[#319694] hover:text-[#267b79] text-sm flex items-center font-medium"
                >
                  Reset filters
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Simulation Runs</h3>
                <HistoryDropdown 
                  history={filteredHistory} 
                  onSelect={handleSelectResult}
                  selectedId={selectedResult?.id}
                  onDelete={(id) => setShowDeleteConfirm(id)}
                />
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 shadow-sm h-full">
                <HistoryDetails 
                  result={selectedResult || filteredHistory[0]} 
                  onViewResults={onViewResults}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Delete Simulation</h3>
              <p className="text-gray-600 mb-5 text-sm">
                Are you sure you want to delete this simulation and its paired results? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteEntry(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Import Dialog */}
      <AnimatePresence>
        {showImportDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
            onClick={() => setShowImportDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Import History</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Select a backup file to import. This will replace all existing history.
              </p>
              <input
                type="file"
                accept=".json"
                onChange={handleImportHistory}
                className="w-full mb-5 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#319694] file:text-white hover:file:bg-[#267b79] transition-colors"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => setShowImportDialog(false)}
                  className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HistoryTab;