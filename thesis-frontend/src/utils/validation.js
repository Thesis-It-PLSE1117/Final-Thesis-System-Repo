

// Configuration limits
const LIMITS = {
  hosts: { min: 1, max: 1000 },
  vms: { min: 1, max: 10000 },
  pesPerHost: { min: 1, max: 128 },
  mips: { min: 1, max: 1000000 },
  ramPerHost: { min: 1, max: 1048576 }, // 1TB
  cloudlets: { min: 1, max: 100000 },
  iterations: { min: 1, max: 100 },
  fileSize: 500 * 1024 * 1024 // 500MB
};

export const validateSimulationConfig = (config) => {
  const errors = {};
  
  // Validate numeric ranges
  const validations = [
    { field: 'numHosts', limits: LIMITS.hosts, label: 'Number of hosts' },
    { field: 'numVMs', limits: LIMITS.vms, label: 'Number of VMs' },
    { field: 'numPesPerHost', limits: LIMITS.pesPerHost, label: 'PEs per host' },
    { field: 'peMips', limits: LIMITS.mips, label: 'PE MIPS' },
    { field: 'ramPerHost', limits: LIMITS.ramPerHost, label: 'RAM per host' },
    { field: 'vmMips', limits: LIMITS.mips, label: 'VM MIPS' },
    { field: 'numCloudlets', limits: LIMITS.cloudlets, label: 'Number of cloudlets' },
    { field: 'iterations', limits: LIMITS.iterations, label: 'Iterations' }
  ];

  validations.forEach(({ field, limits, label }) => {
    const value = config[field];
    if (value < limits.min || value > limits.max) {
      errors[field] = `${label} must be between ${limits.min} and ${limits.max}`;
    }
  });

  // Special validations
  if (config.vmRam > config.ramPerHost) {
    errors.vmRam = 'VM RAM cannot exceed host RAM';
  }

  if (config.vmMips > config.peMips * config.vmPes) {
    errors.vmMips = 'VM MIPS cannot exceed total PE capacity';
  }

  return errors;
};

export const sanitizeNumericInput = (value, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  const num = parseInt(value, 10);
  return isNaN(num) ? min : Math.max(min, Math.min(max, num));
};

export const validateCSVFile = (file) => {
  if (!file) return ['No file selected'];
  
  const errors = [];
  
  if (file.size > LIMITS.fileSize) {
    errors.push('File size cannot exceed 500MB');
  }
  
  if (!file.name.toLowerCase().endsWith('.csv')) {
    errors.push('File must be a CSV file');
  }
  
  return errors;
};
