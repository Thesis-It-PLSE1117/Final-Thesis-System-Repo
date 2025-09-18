import { useState, useEffect } from 'react';
import { showNotification } from '../components/common/ErrorNotification';
// import { validateSimulationConfig } from '../utils/validation';

// Default configuration - used as fallback when presets are cleared
const DEFAULT_CONFIG = {
  numHosts: 20,               
  numPesPerHost: 8,           
  peMips: 2500,               // 2.5 GHz processors (modern standard)
  ramPerHost: 4096,           // 4GB RAM per host (cost-effective)
  bwPerHost: 10000,           // 10 Gbps network (datacenter standard)
  storagePerHost: 200000,     // 200GB storage per host
  numVMs: 50,                 // 5 VMs per host average (good consolidation ratio)
  vmMips: 1000,               // 1 GHz VM processors (standard cloud VM)
  vmPes: 2,                   // Dual-core VMs (balanced)
  vmRam: 1024,                // 1GB RAM per VM (typical small instance)
  vmBw: 1000,                 // 1 Gbps VM network bandwidth
  vmSize: 10000,              // 10GB storage per VM
  vmScheduler: "TimeShared",   // Fair resource sharing policy
  optimizationAlgorithm: "EACO" // EACO often performs better for cloud scheduling
};

// Preset configurations for different task sizes (including default)
const PRESET_CONFIGS = {
  'default': {
    ...DEFAULT_CONFIG
  },
  '1k-tasks': {
    numHosts: 10,
    numPesPerHost: 4,
    peMips: 2000,
    ramPerHost: 2048,
    bwPerHost: 5000,
    storagePerHost: 100000,
    numVMs: 20,
    vmMips: 800,
    vmPes: 1,
    vmRam: 512,
    vmBw: 500,
    vmSize: 5000,
    vmScheduler: "TimeShared",
    optimizationAlgorithm: "EACO"
  },
  '5k-tasks': {
    numHosts: 20,
    numPesPerHost: 6,
    peMips: 2500,
    ramPerHost: 4096,
    bwPerHost: 10000,
    storagePerHost: 200000,
    numVMs: 50,
    vmMips: 1000,
    vmPes: 2,
    vmRam: 1024,
    vmBw: 1000,
    vmSize: 10000,
    vmScheduler: "TimeShared",
    optimizationAlgorithm: "EACO"
  },
  '10k-tasks': {
    numHosts: 40,
    numPesPerHost: 8,
    peMips: 3000,
    ramPerHost: 8192,
    bwPerHost: 20000,
    storagePerHost: 500000,
    numVMs: 100,
    vmMips: 1500,
    vmPes: 2,
    vmRam: 2048,
    vmBw: 2000,
    vmSize: 20000,
    vmScheduler: "TimeShared",
    optimizationAlgorithm: "EACO"
  },
  '20k-tasks': {
    numHosts: 80,
    numPesPerHost: 12,
    peMips: 3500,
    ramPerHost: 16384,
    bwPerHost: 40000,
    storagePerHost: 1000000,
    numVMs: 200,
    vmMips: 2000,
    vmPes: 4,
    vmRam: 4096,
    vmBw: 4000,
    vmSize: 40000,
    vmScheduler: "TimeShared",
    optimizationAlgorithm: "EACO"
  }
};

/**
 * custom hook for managing simulation configuration
 * i use this since you know for the sake of keeping all config state in one place
 */
export const useSimulationConfig = () => {
  /**
   * I set balanced defaults suitable for academic research and typical workloads
   * These values provide good performance without excessive resource consumption
   */
  const [dataCenterConfig, setDataCenterConfig] = useState(DEFAULT_CONFIG);

  const [cloudletConfig, setCloudletConfig] = useState({
    numCloudlets: 100          // Good balance for testing and research
  });
  
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

  const [workloadFile, setWorkloadFile] = useState(null);
  const [csvRowCount, setCsvRowCount] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState('');
  

  const [cloudletToggleEnabled, setCloudletToggleEnabled] = useState(false);
  const DEFAULT_CLOUDLET_COUNT = 100;

  const applyPresetConfig = (presetName) => {
    const preset = PRESET_CONFIGS[presetName];
    if (preset) {
      setDataCenterConfig(preset);
      setSelectedPreset(presetName)

      // Enable cloudlet toggle when preset is selected
      setCloudletToggleEnabled(true);
      
      // Set cloudlet count based on preset (you can adjust these values as needed)
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
    }
  };


  // Clear preset and revert to default configuration
  const clearPreset = () => {
    // Apply the default preset instead of the DEFAULT_CONFIG constant
    setDataCenterConfig(PRESET_CONFIGS['default']);
    setSelectedPreset('');
    
    // Clear workload file and related state
    setWorkloadFile(null);
    setCsvRowCount(0);
    
    // Keep cloudlet toggle enabled but reset to default count
    setCloudletToggleEnabled(true);
    setCloudletConfig(prev => ({
      ...prev,
      numCloudlets: DEFAULT_CLOUDLET_COUNT
    }));
    
    showNotification('Reverted to default configuration', 'success');
  };

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

  // handle file upload
  const handleFileUpload = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      // Only clear the file and row count, don't reset the preset
      setWorkloadFile(null);
      setCsvRowCount(0);
      
      // If a preset is selected, keep cloudlet toggle enabled
      if (selectedPreset) {
        setCloudletToggleEnabled(true);
      }
      return;
    }
    const file = e.target.files[0];
    if (file && (file.type === 'csv' || file.name.toLowerCase().endsWith('.csv'))) {
      // Don't clear selected preset when uploading a file
      // Set workloadFile immediately to update UI
      setWorkloadFile(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const rows = text.split('\n').filter(row => row.trim() !== '');
        const rowCount = Math.max(0, rows.length - 1); 
        

        setCsvRowCount(rowCount);
        // File is already set above, no need to set again
        
        // when workload file is uploaded, set cloudlets to match file but allow user to adjust
        setCloudletConfig(prev => ({
          ...prev,
          numCloudlets: Math.min(prev.numCloudlets || rowCount, rowCount)
        }));
        
        // disable cloudlet toggle when using workload file
        setCloudletToggleEnabled(false);
      };
      reader.readAsText(file);
    } else {
      showNotification('Please upload a valid CSV file', 'warning');
    }
  };

  // handle preset selection - REPLACED the old implementation
const handlePresetSelect = async (presetName) => {
  if (!presetName) {
    clearPreset();
    return;
  }

  // Apply DC/VM preset immediately
  applyPresetConfig(presetName);

  // Try to load /presets/{presetName}.csv
  try {
    const res = await fetch(`/presets/${presetName}`, {
      headers: { Accept: 'text/csv, text/plain, */*' }
    });

    const contentType = (res.headers.get('content-type') || '').toLowerCase();
    console.info('[preset] fetch', presetName, 'status=', res.status, 'content-type=', contentType);
    const text = await res.text();
    const rows = text.split('\n').filter(r => r.trim() !== '');
    const rowCount = Math.max(0, rows.length - 1);

    const blob = new Blob([text], { type: 'text/csv' });
    const file = new File([blob], `${presetName}.csv`, { type: 'text/csv' });

    setWorkloadFile(file);
    setCsvRowCount(rowCount);
    setCloudletConfig(prev => ({
      ...prev,
      numCloudlets: Math.min(prev.numCloudlets || rowCount, rowCount)
    }));
    setCloudletToggleEnabled(false);

    showNotification(`Loaded preset workload: ${presetName} (${rowCount} rows)`, 'success');
  } catch (err) {
    console.warn('[preset] load failed', err);
    showNotification(`Could not load preset CSV "${presetName}". Make sure /public/presets/${presetName}.csv exists and is served (server returned HTML/404).`, 'warning');
    // don't clear the current workloadFile — leave the user's file as-is
  }
};

  
  // handle cloudlet toggle change
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
  
  // get effective cloudlet count (either user-defined, workload-based, or default)
  const getEffectiveCloudletCount = () => {
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

  // get all config data for saving/running
  const getAllConfig = () => {
    // use the effective cloudlet count which handles workload files and toggle state
    const effectiveCloudletConfig = {
      ...cloudletConfig,
      numCloudlets: getEffectiveCloudletCount()
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
    handleFileUpload,
    handlePresetSelect,
    setIterationConfig,
    setEnableMatlabPlots,
    handleCloudletToggleChange,
    applyPresetConfig,
    clearPreset,
    
    // utilities
    getAllConfig,
    restoreConfig,
    getEffectiveCloudletCount,
    presetConfigs: PRESET_CONFIGS,
    defaultConfig: DEFAULT_CONFIG
  };
};