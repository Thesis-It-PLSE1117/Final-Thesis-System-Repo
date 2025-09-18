import { useState } from 'react';
import { showNotification } from '../components/common/ErrorNotification';
import { DEFAULT_CONFIG, PRESET_CONFIGS } from './constants';

export const useDataCenterConfig = () => {
  const [dataCenterConfig, setDataCenterConfig] = useState(DEFAULT_CONFIG);
  const [selectedPreset, setSelectedPreset] = useState('');

  // handle data center changes with validation
  const handleDataCenterChange = (e) => {
    const { name, value } = e.target;
    
    // i validate here since you know for the sake of preventing invalid configs
    // const errors = validateSimulationConfig({ ...dataCenterConfig, [name]: value });
    // if (Object.keys(errors).length > 0) {
    //   showNotification(Object.values(errors)[0], 'warning');
    //   return;
    // }
    
    if (name === 'optimizationAlgorithm' || name === 'vmScheduler') {
      setDataCenterConfig(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setDataCenterConfig(prev => ({
        ...prev,
        [name]: Number(value)
      }));
    }
  };

  const applyPresetConfig = (presetName) => {
    const preset = PRESET_CONFIGS[presetName];
    if (preset) {
      setDataCenterConfig(preset);
      setSelectedPreset(presetName);
      showNotification(`Applied ${presetName} configuration`, 'success');
    }
  };

  const clearPreset = () => {
    setDataCenterConfig(PRESET_CONFIGS['default']);
    setSelectedPreset('');
    showNotification('Reverted to default configuration', 'success');
  };

  return {
    dataCenterConfig,
    selectedPreset,
    handleDataCenterChange,
    applyPresetConfig,
    clearPreset,
    setDataCenterConfig,
    setSelectedPreset
  };
};