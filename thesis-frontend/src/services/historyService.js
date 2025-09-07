/**
 * history Service
 */

import { getStorageInfo, cleanupStorageIfNeeded } from '../utils/storageUtils';

const HISTORY_KEY = 'simulationHistory';
const MAX_HISTORY_ENTRIES = 100; // Support 50 simulation runs (2 entries per run)

/**
 * get all history entries
 */
export const getHistory = () => {
  try {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
};

/**
 * save simulation results to history
 * creates paired entries for EACO and EPSO results
 */
export const saveToHistory = (results, dataCenterConfig, cloudletConfig, workloadFile) => {
  const timestamp = new Date().toISOString();
  const id = Date.now();
  
  // Create full config object including cloudlet config
  const fullConfig = {
    ...dataCenterConfig,
    numCloudlets: cloudletConfig.numCloudlets,
    workloadType: workloadFile ? 'CSV' : 'Random'
  };
  
  // Helper function to extract plot metadata and analysis without large image data
  const extractPlotAnalysis = (algorithmResults) => {
    const plotData = algorithmResults.plotData;
    if (!plotData) return null;
    
    return {
      algorithm: plotData.algorithm,
      simulationId: plotData.simulationId,
      metrics: plotData.metrics, // Performance metrics are small
      plotCount: plotData.plotPaths ? plotData.plotPaths.length : 0,
      plotTypes: plotData.plotMetadata ? plotData.plotMetadata.map(p => p.type) : [],
      plotMetadata: algorithmResults.plotMetadata || plotData.plotMetadata,
      analysis: algorithmResults.analysis,
      hasPlots: !!(plotData.plotPaths && plotData.plotPaths.length > 0)
    };
  };
  
  const historyEntries = [
    {
      id: `${id}-eaco`,
      timestamp,
      algorithm: 'EACO',
      config: fullConfig,
      // store full rawResults if present so results view can reconstruct exactly
      rawResults: results.eaco.rawResults || null,
      summary: results.eaco.rawResults?.summary || results.eaco.summary,
      energyConsumption: results.eaco.rawResults?.energyConsumption || results.eaco.energyConsumption,
      vmUtilization: results.eaco.rawResults?.vmUtilization || results.eaco.vmUtilization,
      schedulingLog: results.eaco.rawResults?.schedulingLog || results.eaco.schedulingLog,
      // OPTIMIZED: Store only analysis and metadata, not large image data
      plotAnalysis: extractPlotAnalysis(results.eaco),
      // store t-test results for statistical analysis display
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
      // OPTIMIZED: Store only analysis and metadata, not large image data
      plotAnalysis: extractPlotAnalysis(results.epso),
      // store t-test results for statistical analysis display
      tTestResults: results.epso.tTestResults || null,
      simulationId: results.epso.simulationId
    }
  ];
  
  try {
    // Clean up storage if needed before saving
    cleanupStorageIfNeeded(0.7); // Clean at 70% usage
    
    const existingHistory = getHistory();
    const updatedHistory = [...historyEntries, ...existingHistory].slice(0, MAX_HISTORY_ENTRIES);
    
    // Log storage info for debugging
    const storageInfo = getStorageInfo();
    if (storageInfo) {
      console.log(`Storage: ${storageInfo.totalSizeFormatted} / ${storageInfo.estimatedLimitFormatted} (${storageInfo.percentUsed.toFixed(1)}% used)`);
    }
    
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (quotaError) {
      // Handle quota exceeded error
      if (quotaError.name === 'QuotaExceededError' || quotaError.message.includes('quota')) {
        console.log('Storage quota exceeded, applying progressive reduction...');
        // Try progressively smaller sizes: 60 (30 runs), 40 (20 runs), 20 (10 runs)
        const reductionSizes = [60, 40, 20, 10];
        let saved = false;
        
        for (const size of reductionSizes) {
          try {
            const reducedHistory = [...historyEntries, ...existingHistory].slice(0, size);
            localStorage.setItem(HISTORY_KEY, JSON.stringify(reducedHistory));
            console.log(`Successfully saved with ${size} entries (${size/2} simulation runs)`);
            saved = true;
            break;
          } catch (e) {
            console.log(`Failed with ${size} entries, trying smaller...`);
          }
        }
        
        if (!saved) {
          // Last resort: save only current entry
          localStorage.setItem(HISTORY_KEY, JSON.stringify(historyEntries));
        }
      } else {
        throw quotaError;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Failed to save to history:', error);
    // Try to clear history if all else fails
    if (error.name === 'QuotaExceededError') {
      clearHistory();
      console.log('Cleared history due to quota issues');
    }
    return false;
  }
};

/**
 * clear all history entries
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
 * get paired history results
 * returns both EACO and EPSO results from the same simulation run
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
 * delete a specific history entry and its pair
 */
export const deleteHistoryEntry = (resultId) => {
  try {
    const history = getHistory();
    const baseId = resultId.split('-')[0];
    
    // remove both paired entries
    const filteredHistory = history.filter(entry => {
      const entryBaseId = entry.id.split('-')[0];
      return entryBaseId !== baseId;
    });
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filteredHistory));
    return true;
  } catch (error) {
    console.error('Failed to delete history entry:', error);
    return false;
  }
};
