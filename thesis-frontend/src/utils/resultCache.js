import { logger } from './security';

/*
hirap pag sunod sunod na sim haha
*/
const CACHE_VERSION = 'v1';
const CACHE_PREFIX = 'sim_cache_';
const MAX_CACHE_SIZE = 10; 
const CACHE_EXPIRY_HOURS = 24; 

/**
 *generate unique cache key from simconfig
 */
export const generateCacheKey = (config, simulationType = 'raw') => {
  const {
    dataCenterConfig,
    cloudletConfig,
    iterationConfig,
    workloadFile,
    enableMatlabPlots
  } = config;

  //config object for consistent hashing
  const normalizedConfig = {
    numHosts: dataCenterConfig.numHosts,
    numVMs: dataCenterConfig.numVMs,
    numPesPerHost: dataCenterConfig.numPesPerHost,
    peMips: dataCenterConfig.peMips,
    ramPerHost: dataCenterConfig.ramPerHost,
    bwPerHost: dataCenterConfig.bwPerHost,
    storagePerHost: dataCenterConfig.storagePerHost,
    vmMips: dataCenterConfig.vmMips,
    vmPes: dataCenterConfig.vmPes,
    vmRam: dataCenterConfig.vmRam,
    vmBw: dataCenterConfig.vmBw,
    vmSize: dataCenterConfig.vmSize,
    vmScheduler: dataCenterConfig.vmScheduler,

    numCloudlets: cloudletConfig.numCloudlets,

    iterations: iterationConfig.iterations,

    // Workload identifier
    workloadId: workloadFile ? `file_${workloadFile.name}_${workloadFile.size}` : 'synthetic',

    // Plotting option wala na to eh
    enableMatlabPlots: enableMatlabPlots || false,

    // Add simulation type to differentiate cache keys
    simulationType: simulationType // 'raw', 'with-file', 'iterations', 'iterations-with-file', 'compare', 'compare-with-file'
  };

  //hash of the configuration
  const configString = JSON.stringify(normalizedConfig);
  const hash = btoa(configString).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);

  return `${CACHE_PREFIX}${CACHE_VERSION}_${hash}`;
};

/**
 * cached result exists and is still valid
 */
export const getCachedResult = (config, simulationType = 'raw') => {
  try {
    const cacheKey = generateCacheKey(config, simulationType);
    const cached = localStorage.getItem(cacheKey);

    if (!cached) {
      logger.log('[Cache] No cached result found');
      return null;
    }

    const parsedCache = JSON.parse(cached);
    const now = Date.now();
    const expiryTime = CACHE_EXPIRY_HOURS * 60 * 60 * 1000;

    //cache has expired
    if (now - parsedCache.timestamp > expiryTime) {
      logger.log('[Cache] Cached result expired, removing...');
      localStorage.removeItem(cacheKey);
      return null;
    }

    logger.log(`[Cache] HIT! Using cached result from ${new Date(parsedCache.timestamp).toLocaleString()}`);

    //cached results with metadata
    return {
      ...parsedCache.results,
      fromCache: true,
      cachedAt: parsedCache.timestamp,
      cacheKey: cacheKey
    };
  } catch (error) {
    logger.error('[Cache] Error reading cache:', error);
    return null;
  }
};

/**
 * simulation results to cache
 */
export const cacheResult = (config, results) => {
  try {
    const cacheKey = generateCacheKey(config);
    
       //dont cache plot data 
    const resultsToCache = {
      eaco: {
        ...results.eaco,
        plotData: undefined 
      },
      epso: {
        ...results.epso,
        plotData: undefined 
      },
      // keep other important data
      plotsGenerating: false
    };
    
    const cacheEntry = {
      timestamp: Date.now(),
      config: {
        iterations: config.iterationConfig.iterations,
        numVMs: config.dataCenterConfig.numVMs,
        numCloudlets: config.cloudletConfig.numCloudlets
      },
      results: resultsToCache
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
    logger.log('[Cache] Results cached successfully');
    
    // clean up old cache entries
    cleanupOldCache();
    
    return true;
  } catch (error) {
    logger.error('[Cache] Error caching results:', error);
    if (error.name === 'QuotaExceededError') {
      logger.log('[Cache] Storage quota exceeded, clearing old cache...');
      clearAllCache();
    }
    return false;
  }
};

/**
 * maintain storage limits
 */
const cleanupOldCache = () => {
  try {
    const cacheEntries = [];
    
    // Find all cache entries
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        const item = localStorage.getItem(key);
        if (item) {
          try {
            const parsed = JSON.parse(item);
            cacheEntries.push({ key, timestamp: parsed.timestamp });
          } catch (e) {
            //remove
            localStorage.removeItem(key);
          }
        }
      }
    }
    
    // sort by timestamp
    cacheEntries.sort((a, b) => a.timestamp - b.timestamp);
    
    //exceed max cache size
    while (cacheEntries.length > MAX_CACHE_SIZE) {
      const oldest = cacheEntries.shift();
      if (oldest) {
        localStorage.removeItem(oldest.key);
        logger.log('[Cache] Removed old cache entry:', oldest.key);
      }
    }
  } catch (error) {
    logger.error('[Cache] Error during cleanup:', error);
  }
};

/**
 * clear all cached results
 */
export const clearAllCache = () => {
  const keysToRemove = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(CACHE_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
  logger.log(`[Cache] Cleared ${keysToRemove.length} cached results`);
  
  return keysToRemove.length;
};

/**
 *cache statistics
 */
export const getCacheStats = () => {
  const stats = {
    totalCached: 0,
    totalSize: 0,
    oldestEntry: null,
    newestEntry: null,
    entries: []
  };
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(CACHE_PREFIX)) {
      const item = localStorage.getItem(key);
      if (item) {
        stats.totalCached++;
        stats.totalSize += item.length;
        
        try {
          const parsed = JSON.parse(item);
          const entry = {
            key,
            timestamp: parsed.timestamp,
            config: parsed.config,
            size: item.length
          };
          
          stats.entries.push(entry);
          
          if (!stats.oldestEntry || parsed.timestamp < stats.oldestEntry.timestamp) {
            stats.oldestEntry = entry;
          }
          if (!stats.newestEntry || parsed.timestamp > stats.newestEntry.timestamp) {
            stats.newestEntry = entry;
          }
        } catch (e) {
        }
      }
    }
  }
  
  //convert size 
  stats.totalSizeFormatted = formatBytes(stats.totalSize);
  
  return stats;
};

/**
 * format 
 */
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Check if caching is available and working
 */
export const isCacheAvailable = () => {
  try {
    const testKey = 'cache_test';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    console.warn('[Cache] LocalStorage not available:', e);
    return false;
  }
};

export default {
  generateCacheKey,
  getCachedResult,
  cacheResult,
  clearAllCache,
  getCacheStats,
  isCacheAvailable
};
