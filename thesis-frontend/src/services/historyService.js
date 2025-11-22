import { openDB, deleteDB } from "idb";

const DB_NAME = "SimulationHistoryDB";
const DB_VERSION = 3; // Increment version for new metadata store
const STORE_NAME = "history";
const METADATA_STORE = "metadata";
const MAX_STORAGE_MB = 450;
const MAX_STORAGE_BYTES = MAX_STORAGE_MB * 1024 * 1024;

let dbPromise = null;

/**
 * Calculate size of an object in bytes
 */
const calculateObjectSize = (obj) => {
  try {
    const jsonString = JSON.stringify(obj);
    // Using Blob to get accurate byte size (handles Unicode properly)
    return new Blob([jsonString]).size;
  } catch (error) {
    console.error("Error calculating object size:", error);
    return 0;
  }
};

/**
 * Format bytes to MB string
 */
const formatMB = (bytes) => {
  return (bytes / (1024 * 1024)).toFixed(2);
};

/**
 * Initialize IndexedDB connection
 */
const initDB = async () => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        // Create history store
        let historyStore;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          historyStore = db.createObjectStore(STORE_NAME, {
            keyPath: "id",
          });
        } else {
          historyStore = transaction.objectStore(STORE_NAME);
        }

        if (!historyStore.indexNames.contains("timestamp")) {
          historyStore.createIndex("timestamp", "timestamp", { unique: false });
        }
        if (!historyStore.indexNames.contains("algorithm")) {
          historyStore.createIndex("algorithm", "algorithm", { unique: false });
        }
        if (!historyStore.indexNames.contains("baseId")) {
          historyStore.createIndex("baseId", "baseId", { unique: false });
        }

        // Create metadata store for tracking storage usage
        if (!db.objectStoreNames.contains(METADATA_STORE)) {
          db.createObjectStore(METADATA_STORE, { keyPath: "key" });
        }
      },
      blocked() {
        console.warn("Database upgrade blocked by other tabs");
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
    await initializeStorageMetadata(db);
  }
  return dbPromise;
};

/**
 * Initialize storage metadata
 */
const initializeStorageMetadata = async (db) => {
  try {
    const tx = db.transaction([METADATA_STORE, STORE_NAME], "readwrite");
    const metadataStore = tx.objectStore(METADATA_STORE);
    const historyStore = tx.objectStore(STORE_NAME);

    // Check if metadata already exists
    const existing = await metadataStore.get("storageUsage");
    
    if (!existing) {
      // Calculate initial storage from existing entries
      const allEntries = await historyStore.getAll();
      const totalSize = allEntries.reduce((sum, entry) => {
        return sum + calculateObjectSize(entry);
      }, 0);

      await metadataStore.put({
        key: "storageUsage",
        totalBytes: totalSize,
        lastUpdated: new Date().toISOString(),
      });

      console.log(`Initialized storage metadata: ${formatMB(totalSize)} MB`);
    }

    await tx.done;
  } catch (error) {
    console.error("Failed to initialize storage metadata:", error);
  }
};

/**
 * Get current storage usage
 */
const getStorageUsage = async (db) => {
  try {
    const tx = db.transaction(METADATA_STORE, "readonly");
    const store = tx.objectStore(METADATA_STORE);
    const metadata = await store.get("storageUsage");
    await tx.done;
    return metadata?.totalBytes || 0;
  } catch (error) {
    console.error("Failed to get storage usage:", error);
    return 0;
  }
};

/**
 * Update storage usage
 */
const updateStorageUsage = async (db, byteDelta) => {
  try {
    const tx = db.transaction(METADATA_STORE, "readwrite");
    const store = tx.objectStore(METADATA_STORE);
    
    const current = await store.get("storageUsage");
    const currentBytes = current?.totalBytes || 0;
    const newBytes = Math.max(0, currentBytes + byteDelta);

    await store.put({
      key: "storageUsage",
      totalBytes: newBytes,
      lastUpdated: new Date().toISOString(),
    });

    await tx.done;
    console.log(`Storage updated: ${formatMB(currentBytes)} MB → ${formatMB(newBytes)} MB (${byteDelta > 0 ? '+' : ''}${formatMB(byteDelta)} MB)`);
    return newBytes;
  } catch (error) {
    console.error("Failed to update storage usage:", error);
    return 0;
  }
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
      console.log(`Migrated ${migrationCount} entries with baseId`);
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
      console.error(`Failed to initialize database (attempt ${i + 1}/${retries}):`, error);

      if (error.name === "VersionError") {
        console.log("Version error detected, clearing database promise and retrying");
        dbPromise = null;

        if (i === retries - 1) {
          try {
            console.log("Attempting to delete existing database");
            await deleteDB(DB_NAME);
            dbPromise = null;
            return await initDB();
          } catch (deleteError) {
            console.error("Failed to delete database:", deleteError);
          }
        }
      } else if (i === retries - 1) {
        throw error;
      }

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

    const entries = await index.getAll();
    return entries.reverse();
  } catch (error) {
    console.error("Failed to load history:", error);
    return [];
  }
};

/**
 * Save simulation results to history
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
    const baseId = id.toString();

    const fullConfig = {
      ...dataCenterConfig,
      numCloudlets: cloudletConfig.numCloudlets,
      workloadType: workloadFile ? "CSV" : "Random",
    };

    if (!results.eaco || !results.epso) {
      console.error("Missing algorithm results:", {
        eaco: !!results.eaco,
        epso: !!results.epso,
      });
      return false;
    }

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

    const historyEntries = [];

    historyEntries.push({
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
    });

    historyEntries.push({
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
    });

    if (results.bpso) {
      historyEntries.push({
        id: `${id}-bpso`,
        baseId,
        timestamp,
        algorithm: "BPSO",
        config: fullConfig,
        rawResults: {
          ...results.bpso.rawResults,
          individualResults: (
            results.bpso.rawResults?.individualResults ||
            results.bpso.individualResults ||
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
            results.bpso.rawResults?.totalIterations ||
            results.bpso.totalIterations ||
            results.bpso.rawResults?.individualResults?.length ||
            results.bpso.individualResults?.length ||
            0,
          averageMetrics:
            results.bpso.rawResults?.averageMetrics ||
            results.bpso.averageMetrics ||
            {},
          minMetrics:
            results.bpso.rawResults?.minMetrics ||
            results.bpso.minMetrics ||
            {},
          maxMetrics:
            results.bpso.rawResults?.maxMetrics ||
            results.bpso.maxMetrics ||
            {},
          stdDevMetrics:
            results.bpso.rawResults?.stdDevMetrics ||
            results.bpso.stdDevMetrics ||
            {},
          bestResult:
            results.bpso.rawResults?.bestResult ||
            results.bpso.bestResult ||
            null,
        },
        summary: results.bpso.rawResults?.summary || results.bpso.summary,
        energyConsumption:
          results.bpso.rawResults?.energyConsumption ||
          results.bpso.energyConsumption,
        vmUtilization:
          results.bpso.rawResults?.vmUtilization || results.bpso.vmUtilization,
        schedulingLog:
          results.bpso.rawResults?.schedulingLog || results.bpso.schedulingLog,
        analysis: results.bpso.analysis || null,
        plotAnalysis: extractPlotAnalysis(results.bpso),
        tTestResults: results.bpso.tTestResults || null,
        wilcoxonTestResults: results.bpso.wilcoxonTestResults || null,
        simulationId: results.bpso.simulationId,
        runId: results.bpso.runId || null,
        seed: results.bpso.seed || null,
        configSnapshot: {
          ...(results.bpso.configSnapshot || fullConfig),
          algorithm: 'BPSO'
        },
        datasetId:
          results.bpso.datasetId ||
          (workloadFile ? "custom-csv" : "synthetic-random"),
      });
    }

    if (results.baco) {
      historyEntries.push({
        id: `${id}-baco`,
        baseId,
        timestamp,
        algorithm: "BACO",
        config: fullConfig,
        rawResults: {
          ...results.baco.rawResults,
          individualResults: (
            results.baco.rawResults?.individualResults ||
            results.baco.individualResults ||
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
            results.baco.rawResults?.totalIterations ||
            results.baco.totalIterations ||
            results.baco.rawResults?.individualResults?.length ||
            results.baco.individualResults?.length ||
            0,
          averageMetrics:
            results.baco.rawResults?.averageMetrics ||
            results.baco.averageMetrics ||
            {},
          minMetrics:
            results.baco.rawResults?.minMetrics ||
            results.baco.minMetrics ||
            {},
          maxMetrics:
            results.baco.rawResults?.maxMetrics ||
            results.baco.maxMetrics ||
            {},
          stdDevMetrics:
            results.baco.rawResults?.stdDevMetrics ||
            results.baco.stdDevMetrics ||
            {},
          bestResult:
            results.baco.rawResults?.bestResult ||
            results.baco.bestResult ||
            null,
        },
        summary: results.baco.rawResults?.summary || results.baco.summary,
        energyConsumption:
          results.baco.rawResults?.energyConsumption ||
          results.baco.energyConsumption,
        vmUtilization:
          results.baco.rawResults?.vmUtilization || results.baco.vmUtilization,
        schedulingLog:
          results.baco.rawResults?.schedulingLog || results.baco.schedulingLog,
        analysis: results.baco.analysis || null,
        plotAnalysis: extractPlotAnalysis(results.baco),
        tTestResults: results.baco.tTestResults || null,
        wilcoxonTestResults: results.baco.wilcoxonTestResults || null,
        simulationId: results.baco.simulationId,
        runId: results.baco.runId || null,
        seed: results.baco.seed || null,
        configSnapshot: {
          ...(results.baco.configSnapshot || fullConfig),
          algorithm: 'BACO'
        },
        datasetId:
          results.baco.datasetId ||
          (workloadFile ? "custom-csv" : "synthetic-random"),
      });
    }

    const sizes = historyEntries.map((entry) => calculateObjectSize(entry));
    const totalNewSize = sizes.reduce((sum, size) => sum + size, 0);

    console.log(`New entries size: ${historyEntries.length} entries, total ${formatMB(totalNewSize)} MB`);

    const db = await getDB();
    const currentUsage = await getStorageUsage(db);

    // Check if adding these entries would exceed the limit
    if (currentUsage + totalNewSize > MAX_STORAGE_BYTES) {
      const excessBytes = (currentUsage + totalNewSize) - MAX_STORAGE_BYTES;
      console.warn(`Storage limit would be exceeded by ${formatMB(excessBytes)} MB`);
      
      // Try to clean up old entries to make space
      const cleanedUp = await cleanupOldEntries(db, totalNewSize);
      
      if (!cleanedUp) {
        throw new Error(`Storage limit exceeded. Need ${formatMB(totalNewSize)} MB but only ${formatMB(MAX_STORAGE_BYTES - currentUsage)} MB available after cleanup.`);
      }
    }

    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    await Promise.all(historyEntries.map((entry) => store.add(entry)));

    await tx.done;

    // Update storage usage
    await updateStorageUsage(db, totalNewSize);

    console.log("Saved simulation results successfully");
    return true;
  } catch (error) {
    console.error("Failed to save to history:", error);
    throw error;
  }
};

/**
 * Clean up old entries to make space
 */
const cleanupOldEntries = async (db, requiredBytes) => {
  try {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const index = store.index("timestamp");

    const allEntries = await index.getAll();
    const currentUsage = await getStorageUsage(db);
    const targetUsage = MAX_STORAGE_BYTES - requiredBytes;

    if (currentUsage <= targetUsage) {
      await tx.done;
      return true;
    }

    // Sort by timestamp (oldest first) and calculate sizes
    const entriesWithSizes = allEntries.map(entry => ({
      entry,
      size: calculateObjectSize(entry),
    }));

    let freedBytes = 0;
    const entriesToDelete = [];

    // Delete oldest entries until we have enough space
    for (const item of entriesWithSizes) {
      if (currentUsage - freedBytes <= targetUsage) {
        break;
      }
      entriesToDelete.push(item.entry.id);
      freedBytes += item.size;
    }

    if (entriesToDelete.length > 0) {
      await Promise.all(entriesToDelete.map(id => store.delete(id)));
      await updateStorageUsage(db, -freedBytes);
      console.log(`Cleaned up ${entriesToDelete.length} entries, freed ${formatMB(freedBytes)} MB`);
    }

    await tx.done;
    return currentUsage - freedBytes + requiredBytes <= MAX_STORAGE_BYTES;
  } catch (error) {
    console.error("Failed to cleanup old entries:", error);
    return false;
  }
};

/**
 * Clear all history entries and reset database
 */
export const clearHistory = async () => {
  try {
    const db = await getDB();
    const tx = db.transaction([STORE_NAME, METADATA_STORE], "readwrite");
    const historyStore = tx.objectStore(STORE_NAME);
    const metadataStore = tx.objectStore(METADATA_STORE);

    await historyStore.clear();
    await metadataStore.put({
      key: "storageUsage",
      totalBytes: 0,
      lastUpdated: new Date().toISOString(),
    });

    await tx.done;

    console.log("History cleared successfully");
    return true;
  } catch (error) {
    console.error("Failed to clear history:", error);

    try {
      console.log("Attempting to reset database");
      if (dbPromise) {
        const db = await dbPromise;
        db.close();
      }
      dbPromise = null;
      await deleteDB(DB_NAME);
      console.log("Database reset successfully");
      return true;
    } catch (resetError) {
      console.error("Failed to reset database:", resetError);
      return false;
    }
  }
};

/**
 * Get paired history results
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
    const bpsoResult = pairedEntries.find(
      (entry) => entry.algorithm === "BPSO",
    );
    const bacoResult = pairedEntries.find(
      (entry) => entry.algorithm === "BACO",
    );

    if (!eacoResult && !epsoResult) {
      console.error("No EACO or EPSO results found in paired entries");
      return null;
    }

    if (!eacoResult) {
      console.warn(`EACO result missing for baseId: "${baseId}"`);
    }

    if (!epsoResult) {
      console.warn(`EPSO result missing for baseId: "${baseId}"`);
    }

    return {
      eaco: eacoResult || null,
      epso: epsoResult || null,
      bpso: bpsoResult || null,
      baco: bacoResult || null,
    };
  } catch (error) {
    console.error("Failed to get paired history results:", error);
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

    const entriesToDelete = await index.getAll(baseId);
    
    // Calculate total size of entries to delete
    const totalSize = entriesToDelete.reduce((sum, entry) => {
      return sum + calculateObjectSize(entry);
    }, 0);

    await Promise.all(entriesToDelete.map((entry) => store.delete(entry.id)));
    await tx.done;

    // Update storage usage
    await updateStorageUsage(db, -totalSize);

    console.log(`Deleted ${entriesToDelete.length} entries, freed ${formatMB(totalSize)} MB`);
    return true;
  } catch (error) {
    console.error("Failed to delete history entry:", error);
    return false;
  }
};

/**
 * Get history statistics
 */
export const getHistoryStats = async () => {
  try {
    const db = await getDB();
    const tx = db.transaction([STORE_NAME, METADATA_STORE], "readonly");
    const historyStore = tx.objectStore(STORE_NAME);
    const metadataStore = tx.objectStore(METADATA_STORE);

    const count = await historyStore.count();
    const simulationCount = Math.floor(count / 2);
    
    const storageData = await metadataStore.get("storageUsage");
    const usedBytes = storageData?.totalBytes || 0;

    await tx.done;

    return {
      totalEntries: count,
      simulationRuns: simulationCount,
      usedStorageMB: parseFloat(formatMB(usedBytes)),
      maxStorageMB: MAX_STORAGE_MB,
      usedBytes,
      maxBytes: MAX_STORAGE_BYTES,
      percentageUsed: ((usedBytes / MAX_STORAGE_BYTES) * 100).toFixed(1),
    };
  } catch (error) {
    console.error("Failed to get history stats:", error);
    return {
      totalEntries: 0,
      simulationRuns: 0,
      usedStorageMB: 0,
      maxStorageMB: MAX_STORAGE_MB,
      usedBytes: 0,
      maxBytes: MAX_STORAGE_BYTES,
      percentageUsed: "0.0",
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

    if (startDate || endDate) {
      results = results.filter((entry) => {
        const entryDate = new Date(entry.timestamp);
        if (startDate && entryDate < new Date(startDate)) return false;
        if (endDate && entryDate > new Date(endDate)) return false;
        return true;
      });
    }

    return results.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
    );
  } catch (error) {
    console.error("Failed to search history:", error);
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
    console.error("Failed to export history:", error);
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
      const bpsoMetadata = backupData.metadata.algorithms.BPSO;
      const bacoMetadata = backupData.metadata.algorithms.BACO;

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

      if (bpsoMetadata) {
        const bpsoRawResults = backupData.bpsoResults || {};
        const bpsoSchedulingLog = bpsoMetadata.schedulingLog || 
          (bpsoRawResults.individualResults && bpsoRawResults.individualResults.length > 0
            ? bpsoRawResults.individualResults[bpsoRawResults.individualResults.length - 1]?.schedulingLog || []
            : []);

        entriesToImport.push({
          id: `${baseId}-bpso`,
          baseId,
          timestamp,
          algorithm: "BPSO",
          config: backupData.configSnapshot || {},
          rawResults: bpsoRawResults,
          summary: bpsoMetadata.summary || {},
          energyConsumption: bpsoMetadata.energyConsumption || 0,
          vmUtilization: bpsoMetadata.vmUtilization || [],
          schedulingLog: bpsoSchedulingLog,
          analysis: bpsoMetadata.analysis || null,
          plotAnalysis: bpsoMetadata.plotAnalysis || null,
          tTestResults: null,
          wilcoxonTestResults: null,
          simulationId: backupData.runId ? `sim#${backupData.runId}` : `sim#${baseId}`,
          runId: backupData.runId || baseId,
          seed: backupData.seed || null,
          configSnapshot: backupData.configSnapshot || {},
          datasetId: backupData.datasetId || "imported-data",
        });
      }

      if (bacoMetadata) {
        const bacoRawResults = backupData.bacoResults || {};
        const bacoSchedulingLog = bacoMetadata.schedulingLog || 
          (bacoRawResults.individualResults && bacoRawResults.individualResults.length > 0
            ? bacoRawResults.individualResults[bacoRawResults.individualResults.length - 1]?.schedulingLog || []
            : []);

        entriesToImport.push({
          id: `${baseId}-baco`,
          baseId,
          timestamp,
          algorithm: "BACO",
          config: backupData.configSnapshot || {},
          rawResults: bacoRawResults,
          summary: bacoMetadata.summary || {},
          energyConsumption: bacoMetadata.energyConsumption || 0,
          vmUtilization: bacoMetadata.vmUtilization || [],
          schedulingLog: bacoSchedulingLog,
          analysis: bacoMetadata.analysis || null,
          plotAnalysis: bacoMetadata.plotAnalysis || null,
          tTestResults: null,
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

    // Calculate size of import
    const importSize = entriesToImport.reduce((sum, entry) => {
      return sum + calculateObjectSize(entry);
    }, 0);

    console.log(`Import size: ${formatMB(importSize)} MB`);

    const db = await getDB();
    const currentUsage = await getStorageUsage(db);

    // Check if import would exceed limit
    if (currentUsage + importSize > MAX_STORAGE_BYTES) {
      const excessBytes = (currentUsage + importSize) - MAX_STORAGE_BYTES;
      console.warn(`Import would exceed storage limit by ${formatMB(excessBytes)} MB`);
      
      // Try to clean up to make space
      const cleanedUp = await cleanupOldEntries(db, importSize);
      
      if (!cleanedUp) {
        throw new Error(`Storage limit exceeded. Import requires ${formatMB(importSize)} MB but only ${formatMB(MAX_STORAGE_BYTES - currentUsage)} MB available after cleanup.`);
      }
    }

    const normalizedEntries = entriesToImport.map((entry) => {
      if (!entry.baseId && entry.id) {
        return {
          ...entry,
          baseId: entry.id.split("-")[0],
        };
      }
      return entry;
    });

    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    await Promise.all(normalizedEntries.map((entry) => store.add(entry)));
    await tx.done;

    // Update storage usage
    await updateStorageUsage(db, importSize);

    console.log(`Imported ${normalizedEntries.length} entries successfully`);
    return true;
  } catch (error) {
    console.error("Import failed:", error.message);
    throw error;
  }
};