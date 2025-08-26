import { useState } from 'react';
import { showNotification } from '../components/common/ErrorNotification';
import { validateSimulationConfig } from '../utils/validation';

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
    numHosts: 10,               // Standard small datacenter (10 physical hosts)
    numPesPerHost: 4,           // Quad-core processors per host (realistic)
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

  // handle data center changes with validation
  const handleDataCenterChange = (e) => {
    const { name, value } = e.target;
    
    // i validate here since you know for the sake of preventing invalid configs
    const errors = validateSimulationConfig({ ...dataCenterConfig, [name]: value });
    if (Object.keys(errors).length > 0) {
      showNotification(Object.values(errors)[0], 'warning');
      return;
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
      return;
    }
    const file = e.target.files[0];
    if (file && (file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv'))) {
      setSelectedPreset('');
      setWorkloadFile(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const rows = text.split('\n').filter(row => row.trim() !== '');
        const rowCount = rows.length - 1;

        setCsvRowCount(rowCount);
        // i auto-adjust cloudlets since you know for the sake of matching csv size
        setCloudletConfig(prev => ({
          ...prev,
          numCloudlets: Math.min(prev.numCloudlets, rowCount)
        }));
      };
      reader.readAsText(file);
    } else {
      showNotification('Please upload a valid CSV file', 'warning');
    }
  };

  // handle preset selection
  const handlePresetSelect = (presetName) => {
    setSelectedPreset(presetName);
    if (!presetName) return;

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
          numCloudlets: Math.min(prev.numCloudlets, rowCount)
        }));
      })
      .catch(() => showNotification('Failed to load preset workload', 'error'));
  };

  // get all config data for saving/running
  const getAllConfig = () => ({
    dataCenterConfig,
    cloudletConfig,
    iterationConfig,
    enableMatlabPlots,
    selectedPreset
  });

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
    
    // handlers
    handleDataCenterChange,
    handleCloudletChange,
    handleFileUpload,
    handlePresetSelect,
    setIterationConfig,
    setEnableMatlabPlots,
    
    // utilities
    getAllConfig,
    restoreConfig
  };
};
