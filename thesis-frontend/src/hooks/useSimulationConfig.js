import { useState, useEffect } from 'react';
import { useDataCenterConfig } from './useDataCenterConfig';
import { useCloudletConfig } from './useCloudletConfig';
import { useWorkloadFile } from './useWorkloadFile';
import { DEFAULT_CLOUDLET_COUNT, PRESET_CONFIGS, DEFAULT_CONFIG } from './constants';

/**
 * custom hook for managing simulation configuration
 * i use this since you know for the sake of keeping all config state in one place
 */
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
    handleCloudletToggleChange,
    getEffectiveCloudletCount,
    setCloudletConfig,
    setCloudletToggleEnabled,
    setCsvRowCount
  } = useCloudletConfig();

  const {
    workloadFile,
    handleFileUpload,
    handlePresetSelect,
    setWorkloadFile
  } = useWorkloadFile(setCsvRowCount, setCloudletConfig, setCloudletToggleEnabled);

  /**
   * I disable MATLAB plots by default since users can enable when needed
   */
  const [enableMatlabPlots, setEnableMatlabPlots] = useState(false);
  
  /**
   * I set iterations to 30 by default for better statistical analysis
   * This provides more reliable results for academic research
   */
  const [iterationConfig, setIterationConfigState] = useState({
    iterations: 30,  // Default to 30 iterations for better analysis
  });
  
  // wrapper for setIterationConfig to handle MATLAB toggle
  const setIterationConfig = (newConfig) => {
    setIterationConfigState(newConfig);
    // automatically disable MATLAB plots if iterations > 1
    if (newConfig.iterations > 1 && enableMatlabPlots) {
      setEnableMatlabPlots(false);
    }
  };

  // Enhanced applyPresetConfig that also handles cloudlet settings
  const enhancedApplyPresetConfig = (presetName) => {
    applyPresetConfig(presetName);

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
  };

  // Enhanced clearPreset that also handles cloudlet settings
  const enhancedClearPreset = () => {
    clearPreset();
    
    // Clear workload file and related state
    setWorkloadFile(null);
    setCsvRowCount(0);
    
    // Keep cloudlet toggle enabled but reset to default count
    setCloudletToggleEnabled(true);
    setCloudletConfig(prev => ({
      ...prev,
      numCloudlets: DEFAULT_CLOUDLET_COUNT
    }));
  };

  // Enhanced handlePresetSelect that also applies data center config
  const enhancedHandlePresetSelect = async (presetName) => {
    if (!presetName) {
      enhancedClearPreset();
      return;
    }

    // Apply DC/VM preset immediately
    enhancedApplyPresetConfig(presetName);

    // Load the workload file
    await handlePresetSelect(presetName, setSelectedPreset);
  };

  // get all config data for saving/running
  const getAllConfig = () => {
    // use the effective cloudlet count which handles workload files and toggle state
    const effectiveCloudletConfig = {
      ...cloudletConfig,
      numCloudlets: getEffectiveCloudletCount(workloadFile)
    };
    
    return {
      dataCenterConfig,
      cloudletConfig: effectiveCloudletConfig,
      iterationConfig,
      enableMatlabPlots,
      selectedPreset
    };
  };

  // restore config from saved state
  const restoreConfig = (savedConfig) => {
    if (savedConfig.dataCenterConfig) setDataCenterConfig(savedConfig.dataCenterConfig);
    if (savedConfig.cloudletConfig) setCloudletConfig(savedConfig.cloudletConfig);
    if (savedConfig.iterationConfig) setIterationConfig(savedConfig.iterationConfig);
    if (savedConfig.enableMatlabPlots !== undefined) setEnableMatlabPlots(savedConfig.enableMatlabPlots);
    if (savedConfig.selectedPreset !== undefined) setSelectedPreset(savedConfig.selectedPreset);
    if (savedConfig.cloudletToggleEnabled !== undefined) setCloudletToggleEnabled(savedConfig.cloudletToggleEnabled);
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
    handleFileUpload: (e) => handleFileUpload(e),
    handlePresetSelect: enhancedHandlePresetSelect,
    setIterationConfig,
    setEnableMatlabPlots,
    handleCloudletToggleChange,
    applyPresetConfig: enhancedApplyPresetConfig,
    clearPreset: enhancedClearPreset,
    
    // utilities
    getAllConfig,
    restoreConfig,
    getEffectiveCloudletCount: () => getEffectiveCloudletCount(workloadFile),
    presetConfigs: PRESET_CONFIGS,
    defaultConfig: DEFAULT_CONFIG
  };
};