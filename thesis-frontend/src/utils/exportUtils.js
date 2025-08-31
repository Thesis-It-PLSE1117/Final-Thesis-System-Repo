
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
    // Create vertical layout CSV where rows are fields and columns are simulations
    // This is much easier to read in Excel when viewing a single simulation
    
    // Define the field structure with sections
    const fieldDefinitions = [
      // === BASIC IDENTIFICATION ===
      { section: 'IDENTIFICATION', field: 'ID', extractor: (item) => item.id || 'N/A' },
      { section: 'IDENTIFICATION', field: 'Timestamp', extractor: (item) => item.timestamp || new Date().toISOString() },
      { section: 'IDENTIFICATION', field: 'Algorithm', extractor: (item) => item.algorithm || 'N/A' },
      { section: 'IDENTIFICATION', field: 'Simulation ID', extractor: (item) => item.simulationId || 'N/A' },
      
      // === CONFIGURATION ===
      { section: 'CONFIGURATION', field: 'Hosts', extractor: (item) => item.config?.numHosts || 'N/A' },
      { section: 'CONFIGURATION', field: 'VMs', extractor: (item) => item.config?.numVMs || 'N/A' },
      { section: 'CONFIGURATION', field: 'Cloudlets', extractor: (item) => item.config?.numCloudlets || 'N/A' },
      { section: 'CONFIGURATION', field: 'VM Scheduler', extractor: (item) => item.config?.vmScheduler || 'N/A' },
      { section: 'CONFIGURATION', field: 'Cloudlet Scheduler', extractor: (item) => item.config?.cloudletScheduler || 'N/A' },
      { section: 'CONFIGURATION', field: 'Optimization Algorithm', extractor: (item) => item.config?.optimizationAlgorithm || 'N/A' },
      { section: 'CONFIGURATION', field: 'Workload Type', extractor: (item) => item.config?.workloadType || 'N/A' },
      { section: 'CONFIGURATION', field: 'Host RAM (MB)', extractor: (item) => item.config?.hostRam || 'N/A' },
      { section: 'CONFIGURATION', field: 'Host BW (Mbps)', extractor: (item) => item.config?.hostBw || 'N/A' },
      { section: 'CONFIGURATION', field: 'Host Storage (MB)', extractor: (item) => item.config?.hostStorage || 'N/A' },
      { section: 'CONFIGURATION', field: 'Host MIPS', extractor: (item) => item.config?.hostMips || 'N/A' },
      { section: 'CONFIGURATION', field: 'VM RAM (MB)', extractor: (item) => item.config?.vmRam || 'N/A' },
      { section: 'CONFIGURATION', field: 'VM BW (Mbps)', extractor: (item) => item.config?.vmBw || 'N/A' },
      { section: 'CONFIGURATION', field: 'VM Size (MB)', extractor: (item) => item.config?.vmSize || 'N/A' },
      { section: 'CONFIGURATION', field: 'VM MIPS', extractor: (item) => item.config?.vmMips || 'N/A' },
      
      // === PERFORMANCE METRICS ===
      { section: 'PERFORMANCE', field: 'Makespan (ms)', extractor: (item) => item.summary?.makespan?.toFixed(2) || '0.00' },
      { section: 'PERFORMANCE', field: 'Resource Utilization (%)', extractor: (item) => (item.summary?.resourceUtilization || item.summary?.utilization)?.toFixed(2) || '0.00' },
      { section: 'PERFORMANCE', field: 'Load Balance (DI)', extractor: (item) => (item.summary?.loadBalance || item.summary?.imbalanceDegree || item.summary?.imbalance)?.toFixed(4) || '0.0000' },
      { section: 'PERFORMANCE', field: 'Total Tasks', extractor: (item) => item.summary?.totalTasks || item.config?.numCloudlets || 'N/A' },
      { section: 'PERFORMANCE', field: 'Successful Tasks', extractor: (item) => item.summary?.successfulTasks || 'N/A' },
      { section: 'PERFORMANCE', field: 'Failed Tasks', extractor: (item) => item.summary?.failedTasks || 0 },
      { section: 'PERFORMANCE', field: 'Success Rate (%)', extractor: (item) => item.summary?.successRate ? (item.summary.successRate * 100).toFixed(2) : '100.00' },
      { section: 'PERFORMANCE', field: 'Avg Turnaround Time (ms)', extractor: (item) => item.summary?.avgTurnaroundTime?.toFixed(2) || 'N/A' },
      { section: 'PERFORMANCE', field: 'Avg Waiting Time (ms)', extractor: (item) => item.summary?.avgWaitingTime?.toFixed(2) || 'N/A' },
      { section: 'PERFORMANCE', field: 'Avg Response Time (ms)', extractor: (item) => item.summary?.avgResponseTime?.toFixed(2) || 'N/A' },
      { section: 'PERFORMANCE', field: 'Throughput', extractor: (item) => item.summary?.throughput?.toFixed(4) || 'N/A' },
      
      // === ENERGY METRICS ===
      { section: 'ENERGY', field: 'Total Energy (Wh)', extractor: (item) => {
        if (typeof item.energyConsumption === 'number') return item.energyConsumption.toFixed(2);
        return item.energyConsumption?.totalEnergyWh?.toFixed(2) || '0.00';
      }},
      { section: 'ENERGY', field: 'Host Energy (Wh)', extractor: (item) => item.energyConsumption?.hostEnergyWh?.toFixed(2) || 'N/A' },
      { section: 'ENERGY', field: 'VM Energy (Wh)', extractor: (item) => item.energyConsumption?.vmEnergyWh?.toFixed(2) || 'N/A' },
      { section: 'ENERGY', field: 'Network Energy (Wh)', extractor: (item) => item.energyConsumption?.networkEnergyWh?.toFixed(2) || 'N/A' },
      { section: 'ENERGY', field: 'Avg Power (W)', extractor: (item) => item.energyConsumption?.avgPowerW?.toFixed(2) || 'N/A' },
      { section: 'ENERGY', field: 'Peak Power (W)', extractor: (item) => item.energyConsumption?.peakPowerW?.toFixed(2) || 'N/A' },
      { section: 'ENERGY', field: 'Duration (hours)', extractor: (item) => item.energyConsumption?.durationHours?.toFixed(4) || 'N/A' },
      
      // === VM UTILIZATION ===
      { section: 'VM UTILIZATION', field: 'VM Count', extractor: (item) => item.vmUtilization?.length || 'N/A' },
      { section: 'VM UTILIZATION', field: 'Avg VM Utilization (%)', extractor: (item) => {
        if (!item.vmUtilization || !Array.isArray(item.vmUtilization)) return 'N/A';
        const avg = item.vmUtilization.reduce((sum, vm) => sum + (vm.utilization || 0), 0) / item.vmUtilization.length;
        return avg.toFixed(2);
      }},
      { section: 'VM UTILIZATION', field: 'Max VM Utilization (%)', extractor: (item) => {
        if (!item.vmUtilization || !Array.isArray(item.vmUtilization)) return 'N/A';
        return Math.max(...item.vmUtilization.map(vm => vm.utilization || 0)).toFixed(2);
      }},
      { section: 'VM UTILIZATION', field: 'Min VM Utilization (%)', extractor: (item) => {
        if (!item.vmUtilization || !Array.isArray(item.vmUtilization)) return 'N/A';
        return Math.min(...item.vmUtilization.map(vm => vm.utilization || 0)).toFixed(2);
      }},
      { section: 'VM UTILIZATION', field: 'Total Cloudlets Assigned', extractor: (item) => {
        if (!item.vmUtilization || !Array.isArray(item.vmUtilization)) return 'N/A';
        return item.vmUtilization.reduce((sum, vm) => sum + (vm.cloudletCount || 0), 0);
      }},
      
      // === SCHEDULING ===
      { section: 'SCHEDULING', field: 'Total Scheduling Entries', extractor: (item) => item.schedulingLog?.length || 'N/A' },
      { section: 'SCHEDULING', field: 'Completed Tasks', extractor: (item) => {
        if (!item.schedulingLog || !Array.isArray(item.schedulingLog)) return 'N/A';
        return item.schedulingLog.filter(log => log.status === 'COMPLETED').length;
      }},
      { section: 'SCHEDULING', field: 'Failed Tasks', extractor: (item) => {
        if (!item.schedulingLog || !Array.isArray(item.schedulingLog)) return 'N/A';
        return item.schedulingLog.filter(log => log.status === 'FAILED').length;
      }},
      
      // === STATISTICAL ANALYSIS ===
      { section: 'STATISTICAL ANALYSIS', field: 'T-Test Overall Winner', extractor: (item) => item.tTestResults?.overallWinner || 'N/A' },
      { section: 'STATISTICAL ANALYSIS', field: 'Significant Metrics Count', extractor: (item) => item.tTestResults?.significantDifferences ?? 'N/A' },
      { section: 'STATISTICAL ANALYSIS', field: 'Total Metrics Tested', extractor: (item) => {
        if (!item.tTestResults?.metricTests) return 'N/A';
        return Object.keys(item.tTestResults.metricTests).length;
      }},
      { section: 'STATISTICAL ANALYSIS', field: 'Sample Size', extractor: (item) => item.tTestResults?.sampleSize ?? 'N/A' },
      { section: 'STATISTICAL ANALYSIS', field: 'Alpha Level', extractor: (item) => item.tTestResults?.alpha ?? 'N/A' },
      
      { section: 'PLOT ANALYSIS', field: 'Plots Generated', extractor: (item) => item.plotAnalysis?.hasPlots ? 'Yes' : 'No' },
      { section: 'PLOT ANALYSIS', field: 'Plot Count', extractor: (item) => item.plotAnalysis?.plotCount || 0 },
      { section: 'PLOT ANALYSIS', field: 'Plot Types', extractor: (item) => {
        if (!item.plotAnalysis?.plotTypes) return 'N/A';
        return item.plotAnalysis.plotTypes.join(', ');
      }},
      { section: 'PLOT ANALYSIS', field: 'Plot Interpretations Available', extractor: (item) => {
        if (!item.plotAnalysis?.plotMetadata) return 'No';
        const hasInterpretations = item.plotAnalysis.plotMetadata.some(p => p.interpretation);
        return hasInterpretations ? 'Yes' : 'No';
      }},
      
      { section: 'RAW DATA', field: 'VM Utilization JSON', extractor: (item) => JSON.stringify(item.vmUtilization || []) },
      { section: 'RAW DATA', field: 'Scheduling Log JSON', extractor: (item) => JSON.stringify(item.schedulingLog || []) },
      { section: 'RAW DATA', field: 'Plot Analysis JSON', extractor: (item) => JSON.stringify(item.plotAnalysis || null) },
      { section: 'RAW DATA', field: 'T-Test Results JSON', extractor: (item) => JSON.stringify(item.tTestResults || null) },
      { section: 'RAW DATA', field: 'Raw Results JSON', extractor: (item) => JSON.stringify(item.rawResults || null) },
    ];
    
    // Build vertical CSV
    const csvRows = [];
    
    // Header row: Section, Field, then one column per simulation
    const headerRow = ['Section', 'Field'];
    history.forEach((item, index) => {
      // Create a meaningful column header for each simulation
      const colHeader = `${item.algorithm || 'Sim'}_${index + 1}_${new Date(item.timestamp).toLocaleDateString()}`;
      headerRow.push(colHeader);
    });
    csvRows.push(headerRow.join(','));
    
    // Data rows: one row per field
    let currentSection = '';
    fieldDefinitions.forEach(fieldDef => {
      const row = [];
      
      // Add section header (only when it changes)
      if (fieldDef.section !== currentSection) {
        currentSection = fieldDef.section;
        // Add a separator row for new sections
        csvRows.push(['', '', ...history.map(() => '')].join(','));
        csvRows.push([`=== ${currentSection} ===`, '', ...history.map(() => '')].join(','));
      }
      
      row.push(''); // Empty section column for data rows
      row.push(fieldDef.field); // Field name
      
      // Add values for each simulation
      history.forEach(item => {
        const value = fieldDef.extractor(item);
        // Escape values that contain commas or quotes
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          row.push(`"${stringValue.replace(/"/g, '""')}"`);
        } else {
          row.push(stringValue);
        }
      });
      
      csvRows.push(row.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    downloadCSV(csvContent, `simulation_history_vertical_${timestamp}.csv`);
  } else {
    downloadJSON(history, `simulation_history_${timestamp}.json`);
  }
};
