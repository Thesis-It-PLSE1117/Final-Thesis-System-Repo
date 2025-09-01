/**
 * Optimized localStorage History Service
 * Implements compression and data optimization techniques
 */

const HISTORY_KEY = 'simulationHistory';
const MAX_HISTORY_ENTRIES = 50;

// Simple compression using JSON.stringify with replacer
const compressData = (data) => {
  try {
    // Remove null/undefined values and compress repeated data
    return JSON.stringify(data, (key, value) => {
      if (value === null || value === undefined) return undefined;
      if (typeof value === 'number') return Math.round(value * 1000) / 1000; // Round to 3 decimals
      return value;
    });
  } catch (error) {
    console.error('Compression failed:', error);
    return JSON.stringify(data);
  }
};

const decompressData = (compressedString) => {
  try {
    return JSON.parse(compressedString);
  } catch (error) {
    console.error('Decompression failed:', error);
    return null;
  }
};

/**
 * Get storage usage info for localStorage
 */
export const getStorageInfo = () => {
  try {
    let totalUsed = 0;
    let historySize = 0;
    
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const value = localStorage[key];
        totalUsed += key.length + value.length;
        if (key === HISTORY_KEY) {
          historySize = value.length;
        }
      }
    }
    
    // localStorage limit is typically 5MB (5,242,880 bytes)
    const estimatedLimit = 5242880;
    
    return {
      totalUsed: totalUsed,
      historySize: historySize,
      estimatedLimit: estimatedLimit,
      available: estimatedLimit - totalUsed,
      usagePercentage: Math.round((totalUsed / estimatedLimit) * 100),
      historyPercentage: Math.round((historySize / estimatedLimit) * 100)
    };
  } catch (error) {
    console.error('Failed to calculate storage info:', error);
    return null;
  }
};

/**
 * Get all history entries with decompression
 */
export const getHistory = () => {
  try {
    const compressedHistory = localStorage.getItem(HISTORY_KEY);
    if (!compressedHistory) return [];
    
    const history = decompressData(compressedHistory);
    return history || [];
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
};

/**
 * Optimized data extraction - remove large redundant data
 */
const optimizeForStorage = (entry) => {
  const optimized = { ...entry };
  
  // Remove or compress large data structures
  if (optimized.rawResults) {
    // Keep only essential raw results data
    const essential = {
      summary: optimized.rawResults.summary,
      energyConsumption: optimized.rawResults.energyConsumption,
      // Keep only aggregated VM utilization, not detailed logs
      vmUtilization: optimized.rawResults.vmUtilization ? {
        average: optimized.rawResults.vmUtilization.average,
        peak: optimized.rawResults.vmUtilization.peak,
        summary: optimized.rawResults.vmUtilization.summary
      } : null
    };
    optimized.rawResults = essential;
  }
  
  // Truncate scheduling logs if too large
  if (optimized.schedulingLog && optimized.schedulingLog.length > 100) {
    optimized.schedulingLog = [
      ...optimized.schedulingLog.slice(0, 50), // First 50 entries
      { truncated: true, totalEntries: optimized.schedulingLog.length },
      ...optimized.schedulingLog.slice(-50) // Last 50 entries
    ];
  }
  
  // Remove plot image data (keep only metadata and analysis)
  if (optimized.plotAnalysis && optimized.plotAnalysis.plotPaths) {
    delete optimized.plotAnalysis.plotPaths;
  }
  
  return optimized;
};

/**
 * Save simulation results to history with optimization and compression
 */
export const saveToHistory = (results, dataCenterConfig, cloudletConfig, workloadFile) => {
  const timestamp = new Date().toISOString();
  const id = Date.now();
  
  const fullConfig = {
    ...dataCenterConfig,
    numCloudlets: cloudletConfig.numCloudlets,
    workloadType: workloadFile ? 'CSV' : 'Random'
  };
  
  const extractPlotAnalysis = (algorithmResults) => {
    const plotData = algorithmResults.plotData;
    if (!plotData) return null;
    
    return {
      algorithm: plotData.algorithm,
      simulationId: plotData.simulationId,
      metrics: plotData.metrics,
      plotCount: plotData.plotPaths ? plotData.plotPaths.length : 0,
      plotTypes: plotData.plotMetadata ? plotData.plotMetadata.map(p => p.type) : [],
      plotMetadata: algorithmResults.plotMetadata || plotData.plotMetadata,
      analysis: algorithmResults.analysis,
      hasPlots: !!(plotData.plotPaths && plotData.plotPaths.length > 0)
    };
  };
  
  let historyEntries = [
    {
      id: `${id}-eaco`,
      timestamp,
      algorithm: 'EACO',
      config: fullConfig,
      rawResults: results.eaco.rawResults || null,
      summary: results.eaco.rawResults?.summary || results.eaco.summary,
      energyConsumption: results.eaco.rawResults?.energyConsumption || results.eaco.energyConsumption,
      vmUtilization: results.eaco.rawResults?.vmUtilization || results.eaco.vmUtilization,
      schedulingLog: results.eaco.rawResults?.schedulingLog || results.eaco.schedulingLog,
      plotAnalysis: extractPlotAnalysis(results.eaco),
      tTestResults: results.eaco.tTestResults || null,
      simulationId: results.eaco.simulationId
    },
    {
      id: `${id}-epso`,
      timestamp,
      algorithm: 'EPSO',
      config: fullConfig,
      rawResults: results.epso.rawResults || null,
      summary: results.epso.rawResults?.summary || results.epso.summary,
      energyConsumption: results.epso.rawResults?.energyConsumption || results.epso.energyConsumption,
      vmUtilization: results.epso.rawResults?.vmUtilization || results.epso.vmUtilization,
      schedulingLog: results.epso.rawResults?.schedulingLog || results.epso.schedulingLog,
      plotAnalysis: extractPlotAnalysis(results.epso),
      tTestResults: results.epso.tTestResults || null,
      simulationId: results.epso.simulationId
    }
  ];
  
  // Optimize entries for storage
  historyEntries = historyEntries.map(optimizeForStorage);
  
  try {
    const existingHistory = getHistory();
    let updatedHistory = [...historyEntries, ...existingHistory].slice(0, MAX_HISTORY_ENTRIES);
    
    // Try to save with compression
    const compressedData = compressData(updatedHistory);
    
    try {
      localStorage.setItem(HISTORY_KEY, compressedData);
    } catch (quotaError) {
      if (quotaError.name === 'QuotaExceededError' || quotaError.message.includes('quota')) {
        console.log('Storage quota exceeded, reducing history size and optimizing further...');
        
        // More aggressive optimization
        updatedHistory = updatedHistory.slice(0, 20).map(entry => {
          const ultraOptimized = { ...entry };
          
          // Remove even more data
          if (ultraOptimized.schedulingLog) {
            delete ultraOptimized.schedulingLog;
          }
          
          // Keep only summary data from rawResults
          if (ultraOptimized.rawResults) {
            ultraOptimized.rawResults = {
              summary: ultraOptimized.rawResults.summary
            };
          }
          
          return ultraOptimized;
        });
        
        const ultraCompressed = compressData(updatedHistory);
        localStorage.setItem(HISTORY_KEY, ultraCompressed);
        
        console.log('Applied ultra optimization to fit storage quota');
      } else {
        throw quotaError;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Failed to save to history:', error);
    
    // Last resort: clear history if all else fails
    if (error.name === 'QuotaExceededError') {
      clearHistory();
      console.log('Cleared history due to persistent quota issues');
      
      // Try to save just the current entries
      try {
        const compressedCurrent = compressData(historyEntries);
        localStorage.setItem(HISTORY_KEY, compressedCurrent);
        return true;
      } catch (finalError) {
        console.error('Failed to save even current entries:', finalError);
      }
    }
    return false;
  }
};

/**
 * Clear all history entries
 */
export const clearHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear history:', error);
    return false;
  }
};

/**
 * Get paired history results with decompression
 */
export const getPairedHistoryResults = (resultId) => {
  const history = getHistory();
  const baseId = resultId.split('-')[0];
  
  const eacoResult = history.find(r => r.id === `${baseId}-eaco`);
  const epsoResult = history.find(r => r.id === `${baseId}-epso`);
  
  if (eacoResult && epsoResult) {
    return {
      eaco: eacoResult,
      epso: epsoResult
    };
  }
  
  return null;
};

/**
 * Delete a specific history entry and its pair
 */
export const deleteHistoryEntry = (resultId) => {
  try {
    const history = getHistory();
    const baseId = resultId.split('-')[0];
    
    const filteredHistory = history.filter(entry => {
      const entryBaseId = entry.id.split('-')[0];
      return entryBaseId !== baseId;
    });
    
    const compressedData = compressData(filteredHistory);
    localStorage.setItem(HISTORY_KEY, compressedData);
    return true;
  } catch (error) {
    console.error('Failed to delete history entry:', error);
    return false;
  }
};