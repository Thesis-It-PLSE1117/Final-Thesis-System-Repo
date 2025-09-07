export const getDataSize = (data) => {
  try {
    const jsonString = JSON.stringify(data);
    return jsonString.length * 2;
  } catch (error) {
    console.error('Error calculating data size:', error);
    return 0;
  }
};

/**
 * Format bytes to human readable format
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Get localStorage usage information
 */
export const getStorageInfo = () => {
  try {
    let totalSize = 0;
    const items = {};

    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const value = localStorage.getItem(key);
        const size = (key.length + value.length) * 2; // UTF-16
        totalSize += size;
        items[key] = size;
      }
    }

    // Most browsers have a 5-10MB limit
    const estimatedLimit = 5 * 1024 * 1024; // 5MB in bytes
    const percentUsed = (totalSize / estimatedLimit) * 100;

    return {
      totalSize,
      totalSizeFormatted: formatBytes(totalSize),
      items,
      estimatedLimit,
      estimatedLimitFormatted: formatBytes(estimatedLimit),
      percentUsed: Math.min(percentUsed, 100),
      remainingSpace: Math.max(0, estimatedLimit - totalSize),
      remainingSpaceFormatted: formatBytes(Math.max(0, estimatedLimit - totalSize))
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return null;
  }
};

/**
 * Check if there's enough space for new data
 */
export const hasStorageSpace = (newData) => {
  const newDataSize = getDataSize(newData);
  const storageInfo = getStorageInfo();
  
  if (!storageInfo) return true; // Assume we have space if we can't check
  
  return storageInfo.remainingSpace > newDataSize;
};

/**
 * Clean up old entries if storage is getting full
 */
export const cleanupStorageIfNeeded = (threshold = 0.8) => {
  const storageInfo = getStorageInfo();
  
  if (!storageInfo) return;
  
  if (storageInfo.percentUsed / 100 > threshold) {
    console.log(`Storage usage at ${storageInfo.percentUsed.toFixed(1)}%, cleaning up old entries...`);
    
    const sortedItems = Object.entries(storageInfo.items)
      .filter(([key]) => !['simulationHistory', 'currentConfig'].includes(key))
      .sort(([, a], [, b]) => b - a);
    
    for (const [key] of sortedItems) {
      localStorage.removeItem(key);
      console.log(`Removed ${key} from storage`);
      
      const newInfo = getStorageInfo();
      if (newInfo && newInfo.percentUsed / 100 < threshold) {
        break;
      }
    }
  }
};
