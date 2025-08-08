/**
 * history Service
 */

const HISTORY_KEY = 'simulationHistory';
const MAX_HISTORY_ENTRIES = 50;

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
  
  const historyEntries = [
    {
      id: `${id}-eaco`,
      timestamp,
      algorithm: 'EACO',
      config: fullConfig,
      summary: results.eaco.rawResults?.summary || results.eaco.summary,
      energyConsumption: results.eaco.rawResults?.energyConsumption || results.eaco.energyConsumption,
      vmUtilization: results.eaco.rawResults?.vmUtilization || results.eaco.vmUtilization,
      schedulingLog: results.eaco.rawResults?.schedulingLog || results.eaco.schedulingLog,
      plotData: results.eaco.plotData,
      simulationId: results.eaco.simulationId
    },
    {
      id: `${id}-epso`,
      timestamp,
      algorithm: 'EPSO',
      config: fullConfig,
      summary: results.epso.rawResults?.summary || results.epso.summary,
      energyConsumption: results.epso.rawResults?.energyConsumption || results.epso.energyConsumption,
      vmUtilization: results.epso.rawResults?.vmUtilization || results.epso.vmUtilization,
      schedulingLog: results.epso.rawResults?.schedulingLog || results.epso.schedulingLog,
      plotData: results.epso.plotData,
      simulationId: results.epso.simulationId
    }
  ];
  
  try {
    const existingHistory = getHistory();
    const updatedHistory = [...historyEntries, ...existingHistory].slice(0, MAX_HISTORY_ENTRIES);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error('Failed to save to history:', error);
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
