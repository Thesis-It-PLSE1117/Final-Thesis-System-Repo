import { useState } from 'react';
import { DEFAULT_CLOUDLET_COUNT } from './constants';

export const useCloudletConfig = () => {
  const [cloudletConfig, setCloudletConfig] = useState({
    numCloudlets: DEFAULT_CLOUDLET_COUNT
  });
  
  const [cloudletToggleEnabled, setCloudletToggleEnabled] = useState(false);
  const [csvRowCount, setCsvRowCount] = useState(0);

  // handle cloudlet changes
  const handleCloudletChange = (e) => {
    const { name, value } = e.target;
    // i cap this for the sake of not exceeding csv rows
    const newValue = name === 'numCloudlets' && csvRowCount > 0 
      ? Math.min(Number(value), csvRowCount)
      : value;

    setCloudletConfig(prev => ({
      ...prev,
      [name]: Number(newValue)
    }));
  };

  // handle cloudlet toggle change
  const handleCloudletToggleChange = (enabled) => {
    setCloudletToggleEnabled(enabled);
    if (!enabled && csvRowCount > 0) {
      // when toggle is disabled but workload file exists, use file row count
      setCloudletConfig(prev => ({
        ...prev,
        numCloudlets: csvRowCount
      }));
    } else if (!enabled) {
      // when toggle is disabled and no workload, set to default value
      setCloudletConfig(prev => ({
        ...prev,
        numCloudlets: DEFAULT_CLOUDLET_COUNT
      }));
    }
  };

  // get effective cloudlet count (either user-defined, workload-based, or default)
  const getEffectiveCloudletCount = (workloadFile) => {
    // If workload file exists, use the configured cloudlets (limited by file)
    if (csvRowCount > 0 || workloadFile) {
      return cloudletConfig.numCloudlets;
    }
    // If toggle is enabled (and no workload), use configured value
    if (cloudletToggleEnabled) {
      return cloudletConfig.numCloudlets;
    }
    // Otherwise use default
    return DEFAULT_CLOUDLET_COUNT;
  };

  return {
    cloudletConfig,
    cloudletToggleEnabled,
    csvRowCount,
    handleCloudletChange,
    handleCloudletToggleChange,
    getEffectiveCloudletCount,
    setCloudletConfig,
    setCloudletToggleEnabled,
    setCsvRowCount
  };
};