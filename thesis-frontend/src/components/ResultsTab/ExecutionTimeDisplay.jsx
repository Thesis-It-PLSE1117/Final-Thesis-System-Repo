import React from 'react';
import { Timer, GitCompare } from 'lucide-react';

const ExecutionTimeDisplay = ({ eacoResults, epsoResults }) => {
  const getExecutionInfo = (results) => {
    if (!results) return null;
    
    let duration = null;
    let timestamp = null;
    let isComparison = false;

    if (results.totalExecutionTime) {
      duration = results.totalExecutionTime / 1000; 
      isComparison = true;
    } else if (results.executionTimeMs) {
      duration = results.executionTimeMs / 1000; 
    } else if (results.rawResults?.totalExecutionTime) {
      duration = results.rawResults.totalExecutionTime / 1000;
    } else if (results.rawResults?.executionTimeMs) {
      duration = results.rawResults.executionTimeMs / 1000;
    }
    
    timestamp = results.metadata?.timestamp || results.timestamp || new Date().toISOString();
    
    return {
      duration,
      timestamp,
      completedAt: timestamp,
      isComparisonResult: isComparison,
      totalIterations: results.totalIterations || results.rawResults?.totalIterations || results.iterations || 1
    };
  };
  
  const eacoInfo = getExecutionInfo(eacoResults);
  const epsoInfo = getExecutionInfo(epsoResults);
  
  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds) || seconds < 0) {
      return 'N/A';
    }
    
    if (seconds < 60) {
      return `${seconds.toFixed(2)}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    }
  };
  
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'medium'
    });
  };
  
  // Get the latest completion time for overall completion
  const getOverallCompletion = () => {
    const eacoTime = eacoInfo?.completedAt ? new Date(eacoInfo.completedAt) : null;
    const epsoTime = epsoInfo?.completedAt ? new Date(epsoInfo.completedAt) : null;
    
    if (eacoTime && epsoTime) {
      return eacoTime > epsoTime ? eacoTime : epsoTime;
    }
    return eacoTime || epsoTime;
  };
  
  const overallCompletion = getOverallCompletion();
  
  if (!eacoInfo?.duration && !epsoInfo?.duration && !eacoInfo?.isComparisonResult) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Timer size={18} className="text-[#319694]" />
          <h3 className="font-semibold text-gray-800">Execution Time</h3>
          {overallCompletion && (
            <span className="ml-auto text-sm text-gray-500">
              Completed {formatTimestamp(overallCompletion)}
            </span>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Comparison timing */}
        {eacoInfo?.isComparisonResult && eacoInfo?.duration ? (
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <GitCompare className="text-blue-600" size={16} />
              <span className="font-medium text-blue-800">Total Simulation Time</span>
            </div>
            <span className="text-lg font-bold text-blue-700">
              {formatDuration(eacoInfo.duration)}
            </span>
          </div>
        ) : (
          /* Individual algorithm times - Only show total simulation time */
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <GitCompare className="text-blue-600" size={16} />
              <span className="font-medium text-blue-800">Total Simulation Time</span>
            </div>
            <span className="text-lg font-bold text-blue-700">
              {formatDuration(eacoInfo?.duration || epsoInfo?.duration)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutionTimeDisplay;