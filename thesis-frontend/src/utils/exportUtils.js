
export const convertToCSV = (data, headers, mapping) => {
  if (!data || data.length === 0) {
    return '';
  }

  const csvHeaders = headers.join(',');
  
  // data rows 
  const csvRows = data.map(item => {
    return headers.map(header => {
      const value = mapping[header](item);
      // caught commas, spaces
      if (value === null || value === undefined) {
        return '';
      }
      const stringValue = String(value);
      // esc 
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',');
  }).join('\n');

  return `${csvHeaders}\n${csvRows}`;
};

//as csv 
export const downloadCSV = (csvContent, filename = 'data.csv') => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadFile(blob, filename);
};

//as json
export const downloadJSON = (jsonData, filename = 'data.json') => {
  const jsonContent = JSON.stringify(jsonData, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  downloadFile(blob, filename);
};

//blob file
const downloadFile = (blob, filename) => {
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  //clean
  URL.revokeObjectURL(url);
};

//timestamp
export const formatTimestamp = (date = new Date()) => {
  return date.toISOString().replace(/:/g, '-').slice(0, -5);
};

//filename
export const generateFilename = (prefix, extension) => {
  return `${prefix}_${formatTimestamp()}.${extension}`;
};

//flatten
export const flattenObject = (obj, prefix = '') => {
  const flattened = {};
  
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value, newKey));
    } else {
      flattened[newKey] = value;
    }
  });
  
  return flattened;
};

//history of data
export const exportSimulationHistory = (history, format = 'json') => {
  if (!history || history.length === 0) {
    return;
  }

  const timestamp = formatTimestamp();
  
  if (format === 'csv') {
    const headers = [
      'Timestamp',
      'Algorithm',
      'Makespan (ms)',
      'Resource Utilization (%)',
      'Energy Consumption (Wh)',
      'Load Balance',
      'Hosts',
      'VMs',
      'Cloudlets',
      'VM Scheduler',
      'Workload Type',
      'Total Tasks',
      'Success Rate (%)'
    ];
    
    const mapping = {
      'Timestamp': (item) => item.timestamp || new Date().toISOString(),
      'Algorithm': (item) => item.algorithm || item.config?.optimizationAlgorithm || 'N/A',
      'Makespan (ms)': (item) => (item.summary?.makespan || 0).toFixed(2),
      'Resource Utilization (%)': (item) => (item.summary?.resourceUtilization || item.summary?.utilization || 0).toFixed(2),
      'Energy Consumption (Wh)': (item) => {
        const energy = typeof item.energyConsumption === 'number' 
          ? item.energyConsumption 
          : item.energyConsumption?.totalEnergyWh || 0;
        return energy.toFixed(2);
      },
      'Load Balance': (item) => (item.summary?.loadBalance || item.summary?.imbalanceDegree || item.summary?.imbalance || 0).toFixed(4),
      'Hosts': (item) => item.config?.numHosts || 'N/A',
      'VMs': (item) => item.config?.numVMs || 'N/A',
      'Cloudlets': (item) => item.config?.numCloudlets || 'N/A',
      'VM Scheduler': (item) => item.config?.vmScheduler || 'N/A',
      'Workload Type': (item) => item.config?.workloadType || 'N/A',
      'Total Tasks': (item) => item.summary?.totalTasks || item.config?.numCloudlets || 'N/A',
      'Success Rate (%)': (item) => {
        if (item.summary?.successRate !== undefined) {
          return (item.summary.successRate * 100).toFixed(2);
        }
        return '100.00';
      }
    };
    
    const csvContent = convertToCSV(history, headers, mapping);
    downloadCSV(csvContent, `simulation_history_${timestamp}.csv`);
  } else {
    downloadJSON(history, `simulation_history_${timestamp}.json`);
  }
};
