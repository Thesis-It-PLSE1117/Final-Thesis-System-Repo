import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Search } from "lucide-react";
import {
  getHistory,
  clearHistory,
  deleteHistoryEntry,
  getHistoryStats,
  importHistory,
} from "../../services/historyService";
import HistoryPlaceholder from "./SavedResultsPlaceholder";
import { exportSimulationHistory } from "../../utils/exportUtils";
import HistoryDropdown from "./ResultsDropdown";
import HistoryDetails from "./ResultsDetails";
import { DeleteConfirmationDialog, ImportDialog, ImportConfirmationDialog, ClearHistoryConfirmationDialog } from './ResultsDialog';

const HistoryTab = ({ onBack, onViewResults }) => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [historyStats, setHistoryStats] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAlgorithm, setFilterAlgorithm] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [pendingImportData, setPendingImportData] = useState(null);

  // Check if storage is full (95% threshold)
  const isStorageFull = historyStats.usedBytes >= historyStats.maxBytes * 0.95;

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
      setError("Failed to load simulation history");
      console.error("Error loading history:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadHistoryStats = async () => {
    try {
      const stats = await getHistoryStats();
      setHistoryStats(stats);
    } catch (err) {
      console.error("Error loading history stats:", err);
    }
  };

  const filterAndSearchHistory = () => {
    let filtered = [...history];

    // Filter by algorithm
    if (filterAlgorithm !== "all") {
      filtered = filtered.filter((item) => item.algorithm === filterAlgorithm);
    }

    // Search by various fields
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.algorithm.toLowerCase().includes(searchLower) ||
          item.simulationId?.toLowerCase().includes(searchLower) ||
          new Date(item.timestamp).toLocaleDateString().includes(searchLower) ||
          item.config?.workloadType?.toLowerCase().includes(searchLower),
      );
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.timestamp) - new Date(b.timestamp);
        case "newest":
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
        if (
          selectedResult &&
          selectedResult.id.startsWith(resultId.split("-")[0])
        ) {
          setSelectedResult(null);
        }
        setShowDeleteConfirm(null);
      } else {
        alert("Failed to delete history entry");
      }
    } catch (err) {
      console.error("Error deleting history entry:", err);
      alert("Error deleting history entry");
    }
  };

  const handleImportHistory = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const backupData = JSON.parse(text);
      
      setPendingImportData({ backupData, fileInput: event.target });
      setShowImportConfirm(true);
      setShowImportDialog(false);
    } catch (err) {
      console.error("Error importing history:", err);
      alert("Invalid backup file format");
      event.target.value = "";
      setShowImportDialog(false);
    }
  };

  const confirmImport = async () => {
    if (!pendingImportData) return;

    try {
      const success = await importHistory(pendingImportData.backupData);
      if (success) {
        await loadHistory();
        await loadHistoryStats();
        setSelectedResult(null);
        alert("Saved Result imported successfully");
      } else {
        alert("Failed to import saved result");
      }
    } catch (err) {
      console.error("Error during import:", err);
      alert("Error importing saved result");
    } finally {
      if (pendingImportData.fileInput) {
        pendingImportData.fileInput.value = "";
      }
      setPendingImportData(null);
      setShowImportConfirm(false);
    }
  };

  const cancelImport = () => {
    if (pendingImportData?.fileInput) {
      pendingImportData.fileInput.value = "";
    }
    setPendingImportData(null);
    setShowImportConfirm(false);
  };

  const handleClearHistory = () => {
    setShowClearConfirm(true);
  };

  const confirmClearHistory = async () => {
    try {
      const success = await clearHistory();
      if (success) {
        setHistory([]);
        setFilteredHistory([]);
        setSelectedResult(null);
        await loadHistoryStats();
      } else {
        alert("Failed to clear history");
      }
    } catch (err) {
      console.error("Error clearing history:", err);
      alert("Error clearing history");
    } finally {
      setShowClearConfirm(false);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilterAlgorithm("all");
    setSortBy("newest");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#319694]"></div>
        <span className="ml-3 text-gray-600">
          Loading simulation history...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-500 mb-4">
          <svg
            className="w-12 h-12 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
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
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 mb-6 shadow-sm border border-[#319694]/15">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#319694]/10 rounded-lg">
                <History className="text-[#319694]" size={20} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Saved Results
              </h2>
            </div>
            <p className="text-sm text-gray-600 mb-2">
        Track and analyze EPSO/EACO algorithm performance over time
      </p>
            <p className="text-xs text-gray-600 mb-2">
        For <span className="font-semibold">large simulation runs (≥5000 tasks),</span> <span className="font-semibold">import/store one at a time</span> due to not run out of memory.
      </p>
            <div className="text-sm text-gray-600">
              <span className="font-medium text-[#319694]">
                {historyStats.simulationRuns || 0}
              </span>{" "}
              simulation runs •
              <span className="font-medium text-[#319694] ml-1">
                {historyStats.totalEntries || 0}
              </span>{" "}
              total entries
            </div>
            {historyStats.totalEntries > 0 && (
              <div className={`text-sm mt-1 ${isStorageFull ? 'text-red-700 font-medium' : 'text-gray-500'}`}>
                Storage: {historyStats.usedStorageMB} MB / {historyStats.maxStorageMB} MB ({historyStats.percentageUsed}%)
                {isStorageFull && " - Storage Nearly Full"}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">

            {history.length > 0 && !selectedResult && (
               <div className="text-gray-600 text-sm px-3 py-2 rounded border border-gray-200 bg-white">
          Select a simulation run to export
        </div>
            )}

            {history.length > 0 && selectedResult && (
              <div className="relative group">
                <button
                  className="bg-white text-gray-700 px-3 py-2 rounded-lg text-sm border border-gray-200 hover:border-gray-300 hover:bg-gray-50 flex items-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  title="Export run data"
                  onMouseEnter={(e) => {
                    e.currentTarget.classList.add('border-gray-300', 'bg-gray-50');
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.parentElement.querySelector(':hover')) {
                      e.currentTarget.classList.remove('border-gray-300', 'bg-gray-50');
                    }
                  }}
                >
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="whitespace-nowrap">
                    Export Run #
                    {selectedResult.simulationId?.split("#")[1] ||
                      selectedResult.id.split("-")[0]}
                  </span>
                  <svg
                    className="w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100">
                  <button
                    onClick={() => {
                      const baseId = selectedResult.id.split("-")[0];
                      const pairedRuns = history.filter((item) =>
                        item.id.startsWith(baseId),
                      );

                      if (pairedRuns.length === 2) {
                        const runId =
                          selectedResult.simulationId?.split("#")[1] || baseId;
                        exportSimulationHistory(
                          pairedRuns,
                          "json",
                          false,
                          `Run_${runId}`,
                        );
                      } else {
                        alert(
                          "Could not find complete EACO/EPSO pair for this run",
                        );
                      }
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
                    onMouseEnter={(e) => e.currentTarget.classList.add('bg-blue-50', 'text-blue-700')}
                    onMouseLeave={(e) => e.currentTarget.classList.remove('bg-blue-50', 'text-blue-700')}
                  >
                    <svg
                      className="w-4 h-4 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <div className="flex flex-col">
                      <span className="font-medium">Export as JSON</span>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      const baseId = selectedResult.id.split("-")[0];
                      const pairedRuns = history.filter((item) =>
                        item.id.startsWith(baseId),
                      );

                      if (pairedRuns.length === 2) {
                        const runId =
                          selectedResult.simulationId?.split("#")[1] || baseId;
                        exportSimulationHistory(
                          pairedRuns,
                          "csv",
                          false,
                          `Run_${runId}`,
                        );
                      } else {
                        alert(
                          "Could not find complete EACO/EPSO pair for this run",
                        );
                      }
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg border-t border-gray-100"
                    onMouseEnter={(e) => e.currentTarget.classList.add('bg-blue-50', 'text-blue-700')}
                    onMouseLeave={(e) => e.currentTarget.classList.remove('bg-blue-50', 'text-blue-700')}
                  >
                    <svg
                      className="w-4 h-4 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <div className="flex flex-col">
                      <span className="font-medium">Export CSV</span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Import - disabled when storage is full */}
            <button
              onClick={() => setShowImportDialog(true)}
              disabled={isStorageFull}
              className={`px-3 py-2 rounded-lg text-sm border flex items-center transition-colors ${
                isStorageFull
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
              title={
                isStorageFull 
                  ? "Storage nearly full - clear saved results or delete old simulations before importing" 
                  : "Import saved result from backup"
              }
              data-testid="import-button"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              Import JSON
            </button>

            {/* Clear - only show when there's history */}
            {history.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="bg-white text-red-500 px-3 py-2 rounded-lg text-sm border border-red-100 hover:bg-red-50 flex items-center transition-colors"
                title="Clear all history"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {history.length === 0 ? (
        <HistoryPlaceholder />
      ) : (
        <>
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-[#319694]/15">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Simulation Runs
                </h3>
                <HistoryDropdown
                  history={filteredHistory}
                  onSelect={handleSelectResult}
                  selectedId={selectedResult?.id}
                  onDelete={(id) => setShowDeleteConfirm(id)}
                />
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-sm h-full border border-[#319694]/15">
                <HistoryDetails
                  result={selectedResult || filteredHistory[0]}
                  onViewResults={onViewResults}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Dialogs */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <DeleteConfirmationDialog
            showDeleteConfirm={showDeleteConfirm}
            setShowDeleteConfirm={setShowDeleteConfirm}
            handleDeleteEntry={handleDeleteEntry}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showImportDialog && (
          <ImportDialog
            showImportDialog={showImportDialog}
            setShowImportDialog={setShowImportDialog}
            handleImportHistory={handleImportHistory}
            isStorageFull={isStorageFull}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showImportConfirm && (
          <ImportConfirmationDialog
            isOpen={showImportConfirm}
            onConfirm={confirmImport}
            onCancel={cancelImport}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showClearConfirm && (
          <ClearHistoryConfirmationDialog
            isOpen={showClearConfirm}
            onConfirm={confirmClearHistory}
            onCancel={() => setShowClearConfirm(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HistoryTab;
