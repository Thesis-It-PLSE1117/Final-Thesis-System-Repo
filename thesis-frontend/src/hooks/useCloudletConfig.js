import { useState } from 'react';
import { DEFAULT_CLOUDLET_COUNT } from './constants';

export const useCloudletConfig = () => {
  const [cloudletConfig, setCloudletConfig] = useState({
    numCloudlets: DEFAULT_CLOUDLET_COUNT
  });
  
  const [cloudletToggleEnabled, setCloudletToggleEnabled] = useState(false);
  const [csvRowCount, setCsvRowCount] = useState(0);

  const handleCloudletChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === 'numCloudlets' && csvRowCount > 0 
      ? Math.min(Number(value), csvRowCount)
      : value;

    setCloudletConfig(prev => ({
      ...prev,
      [name]: Number(newValue)
    }));
  };

  return {
    cloudletConfig,
    cloudletToggleEnabled,
    csvRowCount,
    handleCloudletChange,
    setCloudletConfig,
    setCloudletToggleEnabled,
    setCsvRowCount
  };
};