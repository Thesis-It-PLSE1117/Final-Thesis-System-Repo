import { useState } from 'react';
import { showNotification } from '../components/common/ErrorNotification';

export const useWorkloadFile = (setCsvRowCount, setCloudletConfig, setCloudletToggleEnabled) => {
  const [workloadFile, setWorkloadFile] = useState(null);

  // handle file upload
  const handleFileUpload = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      // Only clear the file and row count, don't reset the preset
      setWorkloadFile(null);
      setCsvRowCount(0);
      return;
    }
    
    const file = e.target.files[0];
    if (file && (file.type === 'csv' || file.name.toLowerCase().endsWith('.csv'))) {
      // Set workloadFile immediately to update UI
      setWorkloadFile(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const rows = text.split('\n').filter(row => row.trim() !== '');
        const rowCount = Math.max(0, rows.length - 1); 
        
        setCsvRowCount(rowCount);
        
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

  // handle preset selection
  const handlePresetSelect = async (presetName, setSelectedPreset) => {
    if (!presetName) {
      setWorkloadFile(null);
      setCsvRowCount(0);
      setSelectedPreset('');
      return;
    }

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
      setSelectedPreset(presetName);

      showNotification(`Loaded preset workload: ${presetName} (${rowCount} rows)`, 'success');
    } catch (err) {
      console.warn('[preset] load failed', err);
      showNotification(`Could not load preset CSV "${presetName}". Make sure /public/presets/${presetName}.csv exists and is served (server returned HTML/404).`, 'warning');
      // don't clear the current workloadFile — leave the user's file as-is
    }
  };

  return {
    workloadFile,
    handleFileUpload,
    handlePresetSelect,
    setWorkloadFile
  };
};