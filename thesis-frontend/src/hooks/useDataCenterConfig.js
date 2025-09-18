import { useState } from 'react';
import { showNotification } from '../components/common/ErrorNotification';
import { DEFAULT_CONFIG, PRESET_CONFIGS } from './constants';

export const useDataCenterConfig = () => {
  const [dataCenterConfig, setDataCenterConfig] = useState(DEFAULT_CONFIG);
  const [selectedPreset, setSelectedPreset] = useState('');

  const handleDataCenterChange = (e) => {
    const { name, value, type } = e.target;
    
    // Check if this is a preset selection from a dropdown/select
    if (name === 'applyPreset') {
      // Handle preset selection separately
      applyPresetConfig(value);
      return;
    }
    
    // Clear preset when manually changing config
    if (selectedPreset && name !== 'applyPreset') {
      setSelectedPreset('');
    }
    
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
      showNotification(`Applied ${presetName} configuration preset`, 'success');
      return true;
    }
    showNotification(`Preset ${presetName} not found`, 'error');
    return false;
  };

  const clearPreset = () => {
    setDataCenterConfig(DEFAULT_CONFIG);
    setSelectedPreset('');
    showNotification('Cleared preset configuration', 'info');
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