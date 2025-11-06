/**
 * History Service using IndexedDB
 * Requires: npm install idb
 */

import { openDB, deleteDB } from "idb";

const DB_NAME = "SimulationHistoryDB";
const DB_VERSION = 2;
const STORE_NAME = "history";
const MAX_HISTORY_ENTRIES = 10;

let dbPromise = null;

/**
 * Initialize IndexedDB connection
 */
const initDB = async () => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        let store;

        if (!db.objectStoreNames.contains(STORE_NAME)) {
          store = db.createObjectStore(STORE_NAME, {
            keyPath: "id",
          });
        } else {
          store = transaction.objectStore(STORE_NAME);
        }

        if (!store.indexNames.contains("timestamp")) {
          store.createIndex("timestamp", "timestamp", { unique: false });
        }

        if (!store.indexNames.contains("algorithm")) {
          store.createIndex("algorithm", "algorithm", { unique: false });
        }

        if (!store.indexNames.contains("baseId")) {
          store.createIndex("baseId", "baseId", { unique: false });
        }
      },
      blocked() {
        // Database upgrade blocked by other tabs
      },
      blocking() {
        if (dbPromise) {
          dbPromise.then((db) => db.close());
          dbPromise = null;
        }
      },
    });

    const db = await dbPromise;
    await migrateExistingEntries(db);
  }
  return dbPromise;
};

const migrateExistingEntries = async (db) => {
  try {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const allEntries = await store.getAll();

    let migrationCount = 0;
    for (const entry of allEntries) {
      if (!entry.baseId && entry.id) {
        const baseId = entry.id.split("-")[0];
        entry.baseId = baseId;
        await store.put(entry);
        migrationCount++;
      }
    }

    if (migrationCount > 0) {
      // Migration complete
    }

    await tx.done;
  } catch (error) {
    console.warn("Migration of existing entries failed:", error);
  }
};

/**
 * Get database instance with retry logic
 */
const getDB = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await initDB();
    } catch (error) {
      // Failed to initialize database

      if (error.name === "VersionError") {
        // Version error detected, clearing database promise and retrying
        dbPromise = null;

        // If it's the last retry, try to delete and recreate the database
        if (i === retries - 1) {
          try {
            // Attempting to delete existing database
            await deleteDB(DB_NAME);
            dbPromise = null;
            return await initDB();
          } catch (deleteError) {
            // Failed to delete database
          }
        }
      } else if (i === retries - 1) {
        throw error;
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, 100 * (i + 1)));
    }
  }
};

/**
 * Get all history entries, sorted by timestamp (newest first)
 */
export const getHistory = async () => {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const index = store.index("timestamp");

    // Get all entries sorted by timestamp (newest first)
    const entries = await index.getAll();
    return entries.reverse(); // Reverse to get newest first
  } catch (error) {
    // Failed to load history
    return [];
  }
};

/**
 * Save simulation results to history
 * Creates paired entries for EACO and EPSO results
 */
export const saveToHistory = async (
  results,
  dataCenterConfig,
  cloudletConfig,
  workloadFile,
) => {
  try {
    const timestamp = new Date().toISOString();
    const id = Date.now();
    const baseId = id.toString(); // Base ID for pairing entries

    // Create full config object including cloudlet config
    const fullConfig = {
      ...dataCenterConfig,
      numCloudlets: cloudletConfig.numCloudlets,
      workloadType: workloadFile ? "CSV" : "Random",
    };

    // Ensure we have all required data before saving
    if (!results.eaco || !results.epso) {
      console.error("Missing algorithm results:", {
        eaco: !!results.eaco,
        epso: !!results.epso,
      });
      return false;
    }


    // Helper function to extract plot metadata and analysis without large image data
    const extractPlotAnalysis = (algorithmResults) => {
      if (!algorithmResults) return null;

      const plotData = algorithmResults.plotData;
      const analysis = algorithmResults.analysis;

      if (!plotData && !analysis) return null;

      const result = {
        analysis: analysis || null,
        plotMetadata: algorithmResults.plotMetadata || null,
      };

      if (plotData) {
        result.algorithm = plotData.algorithm;
        result.simulationId = plotData.simulationId;
        result.metrics = plotData.metrics;
        result.plotCount = plotData.plotPaths ? plotData.plotPaths.length : 0;
        result.plotTypes = plotData.plotMetadata
          ? plotData.plotMetadata.map((p) => p.type)
          : [];
        result.hasPlots = !!(
          plotData.plotPaths && plotData.plotPaths.length > 0
        );
        if (plotData.plotMetadata) {
          result.plotMetadata = plotData.plotMetadata;
        }
      }

      return result;
    };

    const historyEntries = [
      {
        id: `${id}-eaco`,
        baseId,
        timestamp,
        algorithm: "EACO",
        config: fullConfig,
        rawResults: {
          ...results.eaco.rawResults,
          individualResults: (
            results.eaco.rawResults?.individualResults ||
            results.eaco.individualResults ||
            []
          ).map((result) => ({
            ...result,
            summary: result.summary || {},
            vmUtilization: result.vmUtilization || [],
            schedulingLog: result.schedulingLog || [],
            energyConsumption: result.energyConsumption || 0,
            configSnapshot: result.configSnapshot || {},
          })),
          totalIterations:
            results.eaco.rawResults?.totalIterations ||
            results.eaco.totalIterations ||
            results.eaco.rawResults?.individualResults?.length ||
            results.eaco.individualResults?.length ||
            0,
          averageMetrics:
            results.eaco.rawResults?.averageMetrics ||
            results.eaco.averageMetrics ||
            {},
          minMetrics:
            results.eaco.rawResults?.minMetrics ||
            results.eaco.minMetrics ||
            {},
          maxMetrics:
            results.eaco.rawResults?.maxMetrics ||
            results.eaco.maxMetrics ||
            {},
          stdDevMetrics:
            results.eaco.rawResults?.stdDevMetrics ||
            results.eaco.stdDevMetrics ||
            {},
          bestResult:
            results.eaco.rawResults?.bestResult ||
            results.eaco.bestResult ||
            null,
        },
        summary: results.eaco.rawResults?.summary || results.eaco.summary,
        energyConsumption:
          results.eaco.rawResults?.energyConsumption ||
          results.eaco.energyConsumption,
        vmUtilization:
          results.eaco.rawResults?.vmUtilization || results.eaco.vmUtilization,
        schedulingLog:
          results.eaco.rawResults?.schedulingLog || results.eaco.schedulingLog,
        analysis: results.eaco.analysis || null,
        plotAnalysis: extractPlotAnalysis(results.eaco),
        tTestResults: results.eaco.tTestResults || null,
        wilcoxonTestResults: results.eaco.wilcoxonTestResults || null,
        simulationId: results.eaco.simulationId,
        runId: results.eaco.runId || null,
        seed: results.eaco.seed || null,
        configSnapshot: {
          ...(results.eaco.configSnapshot || fullConfig),
          algorithm: 'EACO'
        },
        datasetId:
          results.eaco.datasetId ||
          (workloadFile ? "custom-csv" : "synthetic-random"),
      },
      {
        id: `${id}-epso`,
        baseId,
        timestamp,
        algorithm: "EPSO",
        config: fullConfig,
        rawResults: {
          ...results.epso.rawResults,
          individualResults: (
            results.epso.rawResults?.individualResults ||
            results.epso.individualResults ||
            []
          ).map((result) => ({
            ...result,
            summary: result.summary || {},
            vmUtilization: result.vmUtilization || [],
            schedulingLog: result.schedulingLog || [],
            energyConsumption: result.energyConsumption || 0,
            configSnapshot: result.configSnapshot || {},
          })),
          totalIterations:
            results.epso.rawResults?.totalIterations ||
            results.epso.totalIterations ||
            results.epso.rawResults?.individualResults?.length ||
            results.epso.individualResults?.length ||
            0,
          averageMetrics:
            results.epso.rawResults?.averageMetrics ||
            results.epso.averageMetrics ||
            {},
          minMetrics:
            results.epso.rawResults?.minMetrics ||
            results.epso.minMetrics ||
            {},
          maxMetrics:
            results.epso.rawResults?.maxMetrics ||
            results.epso.maxMetrics ||
            {},
          stdDevMetrics:
            results.epso.rawResults?.stdDevMetrics ||
            results.epso.stdDevMetrics ||
            {},
          bestResult:
            results.epso.rawResults?.bestResult ||
            results.epso.bestResult ||
            null,
        },
        summary: results.epso.rawResults?.summary || results.epso.summary,
        energyConsumption:
          results.epso.rawResults?.energyConsumption ||
          results.epso.energyConsumption,
        vmUtilization:
          results.epso.rawResults?.vmUtilization || results.epso.vmUtilization,
        schedulingLog:
          results.epso.rawResults?.schedulingLog || results.epso.schedulingLog,
        analysis: results.epso.analysis || null,
        plotAnalysis: extractPlotAnalysis(results.epso),
        tTestResults: results.epso.tTestResults || null,
        wilcoxonTestResults: results.epso.wilcoxonTestResults || null,
        simulationId: results.epso.simulationId,
        runId: results.epso.runId || null,
        seed: results.epso.seed || null,
        configSnapshot: {
          ...(results.epso.configSnapshot || fullConfig),
          algorithm: 'EPSO'
        },
        datasetId:
          results.epso.datasetId ||
          (workloadFile ? "custom-csv" : "synthetic-random"),
      },
    ];

    const db = await getDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    // Add both entries
    await Promise.all([
      store.add(historyEntries[0]),
      store.add(historyEntries[1]),
    ]);

    await tx.done;

    // Clean up old entries if we exceed the limit
    await cleanupOldEntries();

    // Saved simulation results successfully
    return true;
  } catch (error) {
    // Failed to save to history
    return false;
  }
};

/**
 * Clean up old entries to maintain storage limits
 */
const cleanupOldEntries = async () => {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const index = store.index("timestamp");

    // Get all entries sorted by timestamp (oldest first for cleanup)
    const allEntries = await index.getAll();

    if (allEntries.length > MAX_HISTORY_ENTRIES) {
      // Calculate how many to remove (keep entries in pairs)
      const excessCount = allEntries.length - MAX_HISTORY_ENTRIES;
      const entriesToRemove = allEntries.slice(0, excessCount);

      // Delete excess entries
      await Promise.all(entriesToRemove.map((entry) => store.delete(entry.id)));

      // Cleaned up old history entries
    }

    await tx.done;
  } catch (error) {
    // Failed to cleanup old entries
  }
};

/**
 * Clear all history entries and reset database
 */
export const clearHistory = async () => {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    await store.clear();
    await tx.done;

    // History cleared successfully
    return true;
  } catch (error) {
    // Failed to clear history

    // If clearing fails, try to delete and recreate the entire database
    try {
      // Attempting to reset database
      if (dbPromise) {
        const db = await dbPromise;
        db.close();
      }
      dbPromise = null;
      await deleteDB(DB_NAME);
      // Database reset successfully
      return true;
    } catch (resetError) {
      // Failed to reset database
      return false;
    }
  }
};

/**
| * Get paired history results
| * Returns both EACO and EPSO results from the same simulation run
| */
/**
 * Get paired history results
 * Returns both EACO and EPSO results from the same simulation run
 */
export const getPairedHistoryResults = async (resultId) => {
  try {
    if (!resultId) {
      return null;
    }

    const baseId = resultId.split("-")[0];
    const db = await getDB();

    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const index = store.index("baseId");
    const pairedEntries = await index.getAll(baseId);

    if (pairedEntries.length === 0) {
      return null;
    }

    const eacoResult = pairedEntries.find(
      (entry) => entry.algorithm === "EACO",
    );
    const epsoResult = pairedEntries.find(
      (entry) => entry.algorithm === "EPSO",
    );

    console.log(`🔍 Algorithm breakdown:`, {
      eacoFound: !!eacoResult,
      epsoFound: !!epsoResult,
      eacoId: eacoResult?.id,
      epsoId: epsoResult?.id,
    });

    if (!eacoResult && !epsoResult) {
      console.error(`❌ No EACO or EPSO results found in paired entries`);
      console.log(
        `📋 Actual algorithms found:`,
        pairedEntries.map((entry) => entry.algorithm),
      );
      return null;
    }

    if (!eacoResult) {
      console.warn(`⚠️ EACO result missing for baseId: "${baseId}"`);
    }

    if (!epsoResult) {
      console.warn(`⚠️ EPSO result missing for baseId: "${baseId}"`);
    }

    const result = {
      eaco: eacoResult || null,
      epso: epsoResult || null,
    };

    console.log(`✅ Successfully retrieved paired results:`, {
      hasEaco: !!result.eaco,
      hasEpso: !!result.epso,
      eacoSummary: result.eaco?.summary ? "Available" : "Missing",
      epsoSummary: result.epso?.summary ? "Available" : "Missing",
    });

    return result;
  } catch (error) {
    return null;
  }
};

/**
 * Delete a specific history entry and its pair
 */
export const deleteHistoryEntry = async (resultId) => {
  try {
    const baseId = resultId.split("-")[0];

    const db = await getDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const index = store.index("baseId");

    // Get all entries with the same baseId
    const entriesToDelete = await index.getAll(baseId);

    // Delete all paired entries
    await Promise.all(entriesToDelete.map((entry) => store.delete(entry.id)));

    await tx.done;

    // Deleted history entries successfully
    return true;
  } catch (error) {
    // Failed to delete history entry
    return false;
  }
};

/**
 * Get history statistics
 */
export const getHistoryStats = async () => {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);

    const count = await store.count();
    const simulationCount = Math.floor(count / 2); // Each simulation has 2 entries

    return {
      totalEntries: count,
      simulationRuns: simulationCount,
      maxEntries: MAX_HISTORY_ENTRIES,
    };
  } catch (error) {
    return {
      totalEntries: 0,
      simulationRuns: 0,
      maxEntries: MAX_HISTORY_ENTRIES,
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
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);

    let results;

    if (algorithm) {
      const index = store.index("algorithm");
      results = await index.getAll(algorithm);
    } else {
      results = await store.getAll();
    }

    // Filter by date range if provided
    if (startDate || endDate) {
      results = results.filter((entry) => {
        const entryDate = new Date(entry.timestamp);
        if (startDate && entryDate < new Date(startDate)) return false;
        if (endDate && entryDate > new Date(endDate)) return false;
        return true;
      });
    }

    // Sort by timestamp (newest first)
    return results.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
    );
  } catch (error) {
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
      entries: history,
    };
  } catch (error) {
    return null;
  }
};

/**
 * Import history data from backup
 */
export const importHistory = async (backupData) => {
  try {
    if (!backupData) {
      throw new Error("Invalid backup data format");
    }

    let entriesToImport = [];

    if (backupData.entries && Array.isArray(backupData.entries)) {
      entriesToImport = backupData.entries;
    } else if (backupData.metadata && backupData.metadata.algorithms) {
      const timestamp = new Date().toISOString();
      const baseId = Date.now().toString();

      const eacoMetadata = backupData.metadata.algorithms.EACO;
      const epsoMetadata = backupData.metadata.algorithms.EPSO;

      if (eacoMetadata) {
        const eacoRawResults = backupData.eacoResults || {};
        const eacoSchedulingLog = eacoMetadata.schedulingLog || 
          (eacoRawResults.individualResults && eacoRawResults.individualResults.length > 0
            ? eacoRawResults.individualResults[eacoRawResults.individualResults.length - 1]?.schedulingLog || []
            : []);

        entriesToImport.push({
          id: `${baseId}-eaco`,
          baseId,
          timestamp,
          algorithm: "EACO",
          config: backupData.configSnapshot || {},
          rawResults: eacoRawResults,
          summary: eacoMetadata.summary || {},
          energyConsumption: eacoMetadata.energyConsumption || 0,
          vmUtilization: eacoMetadata.vmUtilization || [],
          schedulingLog: eacoSchedulingLog,
          analysis: eacoMetadata.analysis || null,
          plotAnalysis: eacoMetadata.plotAnalysis || null,
          tTestResults: backupData.ttestResults || null,
          wilcoxonTestResults: null,
          simulationId: backupData.runId ? `sim#${backupData.runId}` : `sim#${baseId}`,
          runId: backupData.runId || baseId,
          seed: backupData.seed || null,
          configSnapshot: backupData.configSnapshot || {},
          datasetId: backupData.datasetId || "imported-data",
        });
      }

      if (epsoMetadata) {
        const epsoRawResults = backupData.epsoResults || {};
        const epsoSchedulingLog = epsoMetadata.schedulingLog || 
          (epsoRawResults.individualResults && epsoRawResults.individualResults.length > 0
            ? epsoRawResults.individualResults[epsoRawResults.individualResults.length - 1]?.schedulingLog || []
            : []);

        entriesToImport.push({
          id: `${baseId}-epso`,
          baseId,
          timestamp,
          algorithm: "EPSO",
          config: backupData.configSnapshot || {},
          rawResults: epsoRawResults,
          summary: epsoMetadata.summary || {},
          energyConsumption: epsoMetadata.energyConsumption || 0,
          vmUtilization: epsoMetadata.vmUtilization || [],
          schedulingLog: epsoSchedulingLog,
          analysis: epsoMetadata.analysis || null,
          plotAnalysis: epsoMetadata.plotAnalysis || null,
          tTestResults: backupData.ttestResults || null,
          wilcoxonTestResults: null,
          simulationId: backupData.runId ? `sim#${backupData.runId}` : `sim#${baseId}`,
          runId: backupData.runId || baseId,
          seed: backupData.seed || null,
          configSnapshot: backupData.configSnapshot || {},
          datasetId: backupData.datasetId || "imported-data",
        });
      }
    } else {
      throw new Error("Unrecognized backup format: missing 'entries' or 'metadata' fields");
    }

    if (entriesToImport.length === 0) {
      throw new Error("No valid entries found in backup data");
    }

    const db = await getDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    const normalizedEntries = entriesToImport.map((entry) => {
      if (!entry.baseId && entry.id) {
        return {
          ...entry,
          baseId: entry.id.split("-")[0],
        };
      }
      return entry;
    });

    await Promise.all(normalizedEntries.map((entry) => store.add(entry)));

    await tx.done;
    return true;
  } catch (error) {
    console.error("Import failed:", error.message);
    return false;
  }
};
