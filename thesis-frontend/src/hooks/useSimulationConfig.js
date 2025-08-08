import { useState } from 'react';
import { showNotification } from '../components/common/ErrorNotification';
import { validateSimulationConfig } from '../utils/validation';

/**
 * custom hook for managing simulation configuration
 * i use this since you know for the sake of keeping all config state in one place
 */
export const useSimulationConfig = () => {
  // data center configuration
  const [dataCenterConfig, setDataCenterConfig] = useState({
    numHosts: 10,
    numPesPerHost: 2,
    peMips: 2000,
    ramPerHost: 2048,
    bwPerHost: 10000,
    storagePerHost: 100000,
    numVMs: 50,
    vmMips: 1000,
    vmPes: 2,
    vmRam: 1024,
    vmBw: 1000,
    vmSize: 10000,
    vmScheduler: "TimeShared",
    optimizationAlgorithm: "EPSO",
  });
  
  // additional configuration for matlab plots
  const [enableMatlabPlots, setEnableMatlabPlots] = useState(false);

  // workload configuration
  const [cloudletConfig, setCloudletConfig] = useState({
    numCloudlets: 100,
  });
  
  // iteration configuration
  const [iterationConfig, setIterationConfig] = useState({
    iterations: 1,
  });

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
