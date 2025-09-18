import { useState } from 'react';
import { showNotification } from '../components/common/ErrorNotification';
import { useDataCenterConfig } from './useDataCenterConfig';
import { useCloudletConfig } from './useCloudletConfig';
import { DEFAULT_CLOUDLET_COUNT, PRESET_CONFIGS, DEFAULT_CONFIG } from './constants';

export const useSimulationConfig = () => {
  const {
    dataCenterConfig,
    selectedPreset,
    handleDataCenterChange,
    applyPresetConfig,
    clearPreset,
    setDataCenterConfig,
    setSelectedPreset
  } = useDataCenterConfig();

  const {
    cloudletConfig,
    cloudletToggleEnabled,
    csvRowCount,
    handleCloudletChange,
    setCloudletConfig,
    setCloudletToggleEnabled,
    setCsvRowCount
  } = useCloudletConfig();

  const [workloadFile, setWorkloadFile] = useState(null);
  const [enableMatlabPlots, setEnableMatlabPlots] = useState(false);
  const [iterationConfig, setIterationConfigState] = useState({
    iterations: 30,
  });

  const setIterationConfig = (newConfig) => {
    setIterationConfigState(newConfig);
    if (newConfig.iterations > 1 && enableMatlabPlots) {
      setEnableMatlabPlots(false);
    }
  };

  // Separate file management functions
  const clearWorkloadFile = () => {
    setWorkloadFile(null);
    setCsvRowCount(0);
    
    // Re-enable cloudlet toggle since we're no longer using a workload file
    setCloudletToggleEnabled(true);
    
    // If there's a selected preset, restore its cloudlet count
    if (selectedPreset) {
      let presetCloudletCount = DEFAULT_CLOUDLET_COUNT;
      switch(selectedPreset) {
        case '1k-tasks':
          presetCloudletCount = 1000;
          break;
        case '5k-tasks':
          presetCloudletCount = 5000;
          break;
        case '10k-tasks':
          presetCloudletCount = 10000;
          break;
        case '20k-tasks':
          presetCloudletCount = 20000;
          break;
        default:
          presetCloudletCount = DEFAULT_CLOUDLET_COUNT;
      }
      
      setCloudletConfig(prev => ({
        ...prev,
        numCloudlets: presetCloudletCount
      }));
    } else {
      // No preset selected, use default cloudlet count
      setCloudletConfig(prev => ({
        ...prev,
        numCloudlets: DEFAULT_CLOUDLET_COUNT
      }));
    }
    
    showNotification('Removed the file successfully', 'success');
  };

  const loadWorkloadFile = (file, rowCount) => {
    setWorkloadFile(file);
    setCsvRowCount(rowCount);
    
    // when workload file is uploaded, set cloudlets to match file but allow user to adjust
    setCloudletConfig(prev => ({
      ...prev,
      numCloudlets: Math.min(prev.numCloudlets || rowCount, rowCount)
    }));
    
    // disable cloudlet toggle when using workload file
    setCloudletToggleEnabled(false);
  };

  // Enhanced applyPresetConfig that handles both DC config and cloudlet settings
  const enhancedApplyPresetConfig = (presetName) => {
    const preset = PRESET_CONFIGS[presetName];
    if (preset) {
      setDataCenterConfig(preset);
      setSelectedPreset(presetName);

      // Enable cloudlet toggle when preset is selected
      setCloudletToggleEnabled(true);
      
      // Set cloudlet count based on preset
      let presetCloudletCount = DEFAULT_CLOUDLET_COUNT;
      switch(presetName) {
        case '1k-tasks':
          presetCloudletCount = 1000;
          break;
        case '5k-tasks':
          presetCloudletCount = 5000;
          break;
        case '10k-tasks':
          presetCloudletCount = 10000;
          break;
        case '20k-tasks':
          presetCloudletCount = 20000;
          break;
        default:
          presetCloudletCount = DEFAULT_CLOUDLET_COUNT;
      }

      setCloudletConfig(prev => ({
        ...prev,
        numCloudlets: presetCloudletCount
      }));

      showNotification(`Applied ${presetName} configuration`, 'success');
      return true;
    }
    return false;
  };

  // Clear preset and revert to default configuration
  const enhancedClearPreset = () => {
    setDataCenterConfig(PRESET_CONFIGS['default']);
    setSelectedPreset('');
  };

  // Handle file upload - preserves selected preset and data center config
  const handleFileUpload = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      clearWorkloadFile();
      return;
    }
    
    const file = e.target.files[0];
    if (file && (file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv'))) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const rows = text.split('\n').filter(row => row.trim() !== '');
        const rowCount = Math.max(0, rows.length - 1); 
        
        loadWorkloadFile(file, rowCount);
      };
      reader.readAsText(file);
    } else {
      showNotification('Please upload a valid CSV file', 'warning');
    }
  };

  // Handle preset selection - the CORRECT implementation
  const handlePresetSelect = async (presetName) => {
    if (!presetName) {
      // Only clear the preset, keep file if exists
      setDataCenterConfig(PRESET_CONFIGS['default']);
      setSelectedPreset('');
      return;
    }

    // Apply DC/VM preset immediately
    enhancedApplyPresetConfig(presetName);

    // Try to load /presets/{presetName}.csv
    try {
      const res = await fetch(`/presets/${presetName}`, {
        headers: { Accept: 'text/csv, text/plain, */*' }
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const contentType = (res.headers.get('content-type') || '').toLowerCase();
      console.info('[preset] fetch', presetName, 'status=', res.status, 'content-type=', contentType);
      
      // Check if response is HTML (indicating a 404 page)
      if (contentType.includes('text/html')) {
        throw new Error('Server returned HTML (likely a 404 page)');
      }
      
      const text = await res.text();
      const rows = text.split('\n').filter(r => r.trim() !== '');
      const rowCount = Math.max(0, rows.length - 1);

      const blob = new Blob([text], { type: 'text/csv' });
      const file = new File([blob], `${presetName}`, { type: 'text/csv' });

      loadWorkloadFile(file, rowCount);
      showNotification(`Loaded preset workload: ${presetName} (${rowCount} rows)`, 'success');
    } catch (err) {
      console.warn('[preset] load failed', err);
      showNotification(`Could not load preset CSV "${presetName}". Make sure /public/presets/${presetName}.csv exists.`, 'warning');
      // Keep the data center config but clear any existing file
      clearWorkloadFile();
    }
  };

  // Handle cloudlet toggle change
  const handleCloudletToggleChange = (enabled) => {
    setCloudletToggleEnabled(enabled);
    if (!enabled && workloadFile) {
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

  // Get effective cloudlet count
  const getEffectiveCloudletCount = () => {
    if (csvRowCount > 0 || workloadFile) {
      return cloudletConfig.numCloudlets;
    }
    if (cloudletToggleEnabled) {
      return cloudletConfig.numCloudlets;
    }
    return DEFAULT_CLOUDLET_COUNT;
  };

  // Get all config data for saving/running
  const getAllConfig = () => {
    const effectiveCloudletConfig = {
      ...cloudletConfig,
      numCloudlets: getEffectiveCloudletCount()
    };
    
    return {
      dataCenterConfig,
      cloudletConfig: effectiveCloudletConfig,
      iterationConfig,
      enableMatlabPlots,
      selectedPreset,
      workloadFile: workloadFile ? workloadFile.name : null,
      cloudletToggleEnabled
    };
  };

  // Restore config from saved state
  const restoreConfig = (savedConfig) => {
    if (savedConfig.dataCenterConfig) setDataCenterConfig(savedConfig.dataCenterConfig);
    if (savedConfig.cloudletConfig) setCloudletConfig(savedConfig.cloudletConfig);
    if (savedConfig.iterationConfig) setIterationConfig(savedConfig.iterationConfig);
    if (savedConfig.enableMatlabPlots !== undefined) setEnableMatlabPlots(savedConfig.enableMatlabPlots);
    if (savedConfig.selectedPreset !== undefined) setSelectedPreset(savedConfig.selectedPreset);
    if (savedConfig.cloudletToggleEnabled !== undefined) setCloudletToggleEnabled(savedConfig.cloudletToggleEnabled);
    // Note: workloadFile cannot be restored from saved state - user must re-upload
  };

  return {
    // state
    dataCenterConfig,
    cloudletConfig,
    iterationConfig,
    enableMatlabPlots,
    workloadFile,
    csvRowCount,
    selectedPreset,
    cloudletToggleEnabled,
    DEFAULT_CLOUDLET_COUNT,
    
    // handlers
    handleDataCenterChange,
    handleCloudletChange,
    handleFileUpload,
    handlePresetSelect,
    setIterationConfig,
    setEnableMatlabPlots,
    handleCloudletToggleChange,
    applyPresetConfig: enhancedApplyPresetConfig,
    clearPreset: enhancedClearPreset,
    clearWorkloadFile, // Expose the separate file clearing function
    
    // utilities
    getAllConfig,
    restoreConfig,
    getEffectiveCloudletCount,
    presetConfigs: PRESET_CONFIGS,
    defaultConfig: DEFAULT_CONFIG
  };
};