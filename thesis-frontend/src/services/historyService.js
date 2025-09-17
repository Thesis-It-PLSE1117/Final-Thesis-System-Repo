/**
 * History Service using IndexedDB
 * Requires: npm install idb
 */

import { openDB, deleteDB } from 'idb';

const DB_NAME = 'SimulationHistoryDB';
const DB_VERSION = 5; // Increased version to handle existing database
const STORE_NAME = 'history';
const MAX_HISTORY_ENTRIES = 200; // Increased limit due to better storage capacity

let dbPromise = null;

/**
 * Initialize IndexedDB connection
 */
const initDB = async () => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        console.log(`Upgrading database from version ${oldVersion} to ${newVersion}`);
        
        // Handle different upgrade paths
        if (oldVersion < 1) {
          // Create the history store if it doesn't exist
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, { 
              keyPath: 'id' 
            });
            
            // Create indices for efficient querying
            store.createIndex('timestamp', 'timestamp', { unique: false });
            store.createIndex('algorithm', 'algorithm', { unique: false });
            store.createIndex('baseId', 'baseId', { unique: false }); // For paired entries
          }
        }
        
        // Handle upgrades from any version to current
        if (db.objectStoreNames.contains(STORE_NAME)) {
          const store = transaction.objectStore(STORE_NAME);
          
          // Ensure all required indices exist
          if (!store.indexNames.contains('timestamp')) {
            store.createIndex('timestamp', 'timestamp', { unique: false });
          }
          if (!store.indexNames.contains('algorithm')) {
            store.createIndex('algorithm', 'algorithm', { unique: false });
          }
          if (!store.indexNames.contains('baseId')) {
            store.createIndex('baseId', 'baseId', { unique: false });
          }
        } else {
          // Create the store if it somehow doesn't exist
          const store = db.createObjectStore(STORE_NAME, { 
            keyPath: 'id' 
          });
          
          // Create all indices
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('algorithm', 'algorithm', { unique: false });
          store.createIndex('baseId', 'baseId', { unique: false });
        }
      },
      blocked() {
        console.log('Database upgrade blocked. Please close other tabs using this application.');
      },
      blocking() {
        console.log('Database is blocking a future version. Closing connection.');
        // Close the database connection to allow the upgrade
        if (dbPromise) {
          dbPromise.then(db => db.close());
          dbPromise = null;
        }
      }
    });
  }
  return dbPromise;
};

/**
 * Get database instance with retry logic
 */
const getDB = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await initDB();
    } catch (error) {
      console.error(`Failed to initialize database (attempt ${i + 1}):`, error);
      
      if (error.name === 'VersionError') {
        console.log('Version error detected, clearing database promise and retrying...');
        dbPromise = null;
        
        // If it's the last retry, try to delete and recreate the database
        if (i === retries - 1) {
          try {
            console.log('Attempting to delete existing database...');
            await deleteDB(DB_NAME);
            dbPromise = null;
            return await initDB();
          } catch (deleteError) {
            console.error('Failed to delete database:', deleteError);
          }
        }
      } else if (i === retries - 1) {
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 100 * (i + 1)));
    }
  }
};

/**
 * Get all history entries, sorted by timestamp (newest first)
 */
export const getHistory = async () => {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('timestamp');
    
    // Get all entries sorted by timestamp (newest first)
    const entries = await index.getAll();
    return entries.reverse(); // Reverse to get newest first
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
};

/**
 * Save simulation results to history
 * Creates paired entries for EACO and EPSO results
 */
export const saveToHistory = async (results, dataCenterConfig, cloudletConfig, workloadFile) => {
  try {
    const timestamp = new Date().toISOString();
    const id = Date.now();
    const baseId = id.toString(); // Base ID for pairing entries
    
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
        baseId,
        timestamp,
        algorithm: 'EACO',
        config: fullConfig,
        // Store full rawResults if present so results view can reconstruct exactly
        rawResults: results.eaco.rawResults || null,
        summary: results.eaco.rawResults?.summary || results.eaco.summary,
        energyConsumption: results.eaco.rawResults?.energyConsumption || results.eaco.energyConsumption,
        vmUtilization: results.eaco.rawResults?.vmUtilization || results.eaco.vmUtilization,
        schedulingLog: results.eaco.rawResults?.schedulingLog || results.eaco.schedulingLog,
        // OPTIMIZED: Store only analysis and metadata, not large image data
        plotAnalysis: extractPlotAnalysis(results.eaco),
        // Store t-test results for statistical analysis display
        tTestResults: results.eaco.tTestResults || null,
        simulationId: results.eaco.simulationId
      },
      {
        id: `${id}-epso`,
        baseId,
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
        // Store t-test results for statistical analysis display
        tTestResults: results.epso.tTestResults || null,
        simulationId: results.epso.simulationId
      }
    ];
    
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    // Add both entries
    await Promise.all([
      store.add(historyEntries[0]),
      store.add(historyEntries[1])
    ]);
    
    await tx.done;
    
    // Clean up old entries if we exceed the limit
    await cleanupOldEntries();
    
    console.log(`Saved simulation results for ${baseId} (EACO & EPSO)`);
    return true;
    
  } catch (error) {
    console.error('Failed to save to history:', error);
    return false;
  }
};

/**
 * Clean up old entries to maintain storage limits
 */
const cleanupOldEntries = async () => {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('timestamp');
    
    // Get all entries sorted by timestamp (oldest first for cleanup)
    const allEntries = await index.getAll();
    
    if (allEntries.length > MAX_HISTORY_ENTRIES) {
      // Calculate how many to remove (keep entries in pairs)
      const excessCount = allEntries.length - MAX_HISTORY_ENTRIES;
      const entriesToRemove = allEntries.slice(0, excessCount);
      
      // Delete excess entries
      await Promise.all(
        entriesToRemove.map(entry => store.delete(entry.id))
      );
      
      console.log(`Cleaned up ${excessCount} old history entries`);
    }
    
    await tx.done;
  } catch (error) {
    console.error('Failed to cleanup old entries:', error);
  }
};

/**
 * Clear all history entries and reset database
 */
export const clearHistory = async () => {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    await store.clear();
    await tx.done;
    
    console.log('History cleared successfully');
    return true;
  } catch (error) {
    console.error('Failed to clear history:', error);
    
    // If clearing fails, try to delete and recreate the entire database
    try {
      console.log('Attempting to reset database...');
      if (dbPromise) {
        const db = await dbPromise;
        db.close();
      }
      dbPromise = null;
      await deleteDB(DB_NAME);
      console.log('Database reset successfully');
      return true;
    } catch (resetError) {
      console.error('Failed to reset database:', resetError);
      return false;
    }
  }
};

/**
 * Get paired history results
 * Returns both EACO and EPSO results from the same simulation run
 */
export const getPairedHistoryResults = async (resultId) => {
  try {
    const baseId = resultId.split('-')[0];
    
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('baseId');
    
    // Get both entries with the same baseId
    const pairedEntries = await index.getAll(baseId);
    
    if (pairedEntries.length >= 2) {
      const eacoResult = pairedEntries.find(entry => entry.algorithm === 'EACO');
      const epsoResult = pairedEntries.find(entry => entry.algorithm === 'EPSO');
      
      if (eacoResult && epsoResult) {
        return {
          eaco: eacoResult,
          epso: epsoResult
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Failed to get paired history results:', error);
    return null;
  }
};

/**
 * Delete a specific history entry and its pair
 */
export const deleteHistoryEntry = async (resultId) => {
  try {
    const baseId = resultId.split('-')[0];
    
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('baseId');
    
    // Get all entries with the same baseId
    const entriesToDelete = await index.getAll(baseId);
    
    // Delete all paired entries
    await Promise.all(
      entriesToDelete.map(entry => store.delete(entry.id))
    );
    
    await tx.done;
    
    console.log(`Deleted history entries for simulation ${baseId}`);
    return true;
  } catch (error) {
    console.error('Failed to delete history entry:', error);
    return false;
  }
};

/**
 * Get history statistics
 */
export const getHistoryStats = async () => {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    
    const count = await store.count();
    const simulationCount = Math.floor(count / 2); // Each simulation has 2 entries
    
    return {
      totalEntries: count,
      simulationRuns: simulationCount,
      maxEntries: MAX_HISTORY_ENTRIES
    };
  } catch (error) {
    console.error('Failed to get history stats:', error);
    return {
      totalEntries: 0,
      simulationRuns: 0,
      maxEntries: MAX_HISTORY_ENTRIES
    };
  }
};

/**
 * Search history by algorithm or date range
 */
export const searchHistory = async (filters = {}) => {
  try {
    const { algorithm, startDate, endDate } = filters;
    
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    
    let results;
    
    if (algorithm) {
      const index = store.index('algorithm');
      results = await index.getAll(algorithm);
    } else {
      results = await store.getAll();
    }
    
    // Filter by date range if provided
    if (startDate || endDate) {
      results = results.filter(entry => {
        const entryDate = new Date(entry.timestamp);
        if (startDate && entryDate < new Date(startDate)) return false;
        if (endDate && entryDate > new Date(endDate)) return false;
        return true;
      });
    }
    
    // Sort by timestamp (newest first)
    return results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
  } catch (error) {
    console.error('Failed to search history:', error);
    return [];
  }
};

/**
 * Export history data for backup
 */
export const exportHistory = async () => {
  try {
    const history = await getHistory();
    return {
      exportDate: new Date().toISOString(),
      version: DB_VERSION,
      entries: history
    };
  } catch (error) {
    console.error('Failed to export history:', error);
    return null;
  }
};

/**
 * Import history data from backup
 */
export const importHistory = async (backupData) => {
  try {
    if (!backupData || !backupData.entries) {
      throw new Error('Invalid backup data format');
    }
    
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    // Clear existing data
    await store.clear();
    
    // Import entries
    await Promise.all(
      backupData.entries.map(entry => store.add(entry))
    );
    
    await tx.done;
    
    console.log(`Imported ${backupData.entries.length} history entries`);
    return true;
  } catch (error) {
    console.error('Failed to import history:', error);
    return false;
  }
};