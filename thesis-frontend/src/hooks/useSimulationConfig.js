import { useState, useEffect } from 'react';
import { showNotification } from '../components/common/ErrorNotification';
// import { validateSimulationConfig } from '../utils/validation';

/**
 * custom hook for managing simulation configuration
 * i use this since you know for the sake of keeping all config state in one place
 */
export const useSimulationConfig = () => {
  /**
   * I set balanced defaults suitable for academic research and typical workloads
   * These values provide good performance without excessive resource consumption
   */
  const [dataCenterConfig, setDataCenterConfig] = useState({
    numHosts: 20,               
    numPesPerHost: 6,           
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
  });

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
      setWorkloadFile(null);
      setCsvRowCount(0);
      // re-enable cloudlet toggle when workload is removed
      if (cloudletToggleEnabled) {
        setCloudletConfig(prev => ({
          ...prev,
          numCloudlets: prev.numCloudlets
        }));
      }
      return;
    }
    const file = e.target.files[0];
    if (file && (file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv'))) {
      setSelectedPreset('');
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
        
        // disable cloudlet toggle 
        setCloudletToggleEnabled(false);
      };
      reader.readAsText(file);
    } else {
      showNotification('Please upload a valid CSV file', 'warning');
    }
  };

  // handle preset selection
  const handlePresetSelect = (presetName) => {
    setSelectedPreset(presetName);
    
    if (!presetName) {
      return;
    }

    fetch(`/presets/${presetName}`)
      .then(res => res.text())
      .then(text => {
        const rows = text.split('\n').filter(r => r.trim() !== '');
        const rowCount = rows.length - 1;

        const blob = new Blob([text], { type: 'text/csv' });
        const file = new File([blob], presetName, { type: 'text/csv' });

        setWorkloadFile(file);
        setCsvRowCount(rowCount);
        setCloudletConfig(prev => ({
          ...prev,
          numCloudlets: Math.min(prev.numCloudlets || rowCount, rowCount)
        }));
        
        // Disable cloudlet toggle when preset is selected
        setCloudletToggleEnabled(false);
      })
      .catch(() => showNotification('Failed to load preset workload', 'error'));
  };
  
  // handle cloudlet toggle change
  const handleCloudletToggleChange = (enabled) => {
    setCloudletToggleEnabled(enabled);
    if (!enabled) {
      // when toggle is disabled, set numCloudlets to default value
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
    
    // utilities
    getAllConfig,
    restoreConfig,
    getEffectiveCloudletCount
  };
};
