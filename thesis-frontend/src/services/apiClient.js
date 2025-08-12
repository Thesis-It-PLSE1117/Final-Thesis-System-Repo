/**
 * I separate api's as a client service
 * 
 */

export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

/**
 * default config
 */
export const run = async (algorithm, config) => {
  const algorithmConfig = {
    ...config,
    optimizationAlgorithm: algorithm
  };
  
  const response = await fetch(`${API_BASE}/api/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(algorithmConfig)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server responded with ${response.status} for ${algorithm}: ${errorText}`);
  }
  
  return response.json();
};

/**
 * with file
 */
export const runWithFile = async (algorithm, config, file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const algorithmConfig = {
    ...config,
    optimizationAlgorithm: algorithm
  };
  
  Object.entries(algorithmConfig).forEach(([key, value]) => {
    formData.append(key, value);
  });
  
  const response = await fetch(`${API_BASE}/api/run-with-file`, {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server responded with ${response.status} for ${algorithm}: ${errorText}`);
  }
  
  return response.json();
};

/**
 * for iterations > 1
 */
export const runIterations = async (algorithm, config) => {
  const algorithmConfig = {
    ...config,
    optimizationAlgorithm: algorithm
  };
  
  const response = await fetch(`${API_BASE}/api/run-iterations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(algorithmConfig)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server responded with ${response.status} for ${algorithm}: ${errorText}`);
  }
  
  const result = await response.json();
  
  // wrap in standard format
  if (result.totalIterations) {
    return {
      rawResults: result,
      summary: result.averageMetrics,
      isIterationResult: true
    };
  }
  
  return result;
};

/**
 * run iterations (file)
 */
export const runIterationsWithFile = async (algorithm, config, file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const algorithmConfig = {
    ...config,
    optimizationAlgorithm: algorithm
  };
  
  Object.entries(algorithmConfig).forEach(([key, value]) => {
    formData.append(key, value);
  });
  
  const response = await fetch(`${API_BASE}/api/run-iterations-with-file`, {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server responded with ${response.status} for ${algorithm}: ${errorText}`);
  }
  
  const result = await response.json();
  
  // wrap in standard format
  if (result.totalIterations) {
    return {
      rawResults: result,
      summary: result.averageMetrics,
      isIterationResult: true
    };
  }
  
  return result;
};

/**
 * simulation with plots
 */
export const runWithPlots = async (algorithm, config) => {
  const algorithmConfig = {
    ...config,
    optimizationAlgorithm: algorithm
  };
  
  const response = await fetch(`${API_BASE}/api/simulate/with-plots`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(algorithmConfig)
  });
  
  if (!response.ok) {
    // for matlab warmup
    if (response.status === 202) {
      const data = await response.json();
      if (data.status === 'WARMING_UP') {
        // signal caller
        throw new Error('MATLAB_WARMING_UP');
      }
    }
    const errorText = await response.text();
    throw new Error(`Server responded with ${response.status} for ${algorithm}: ${errorText}`);
  }
  
  return response.json();
};

/**
 * simulation with async plots - returns immediately with tracking id
 */
export const runWithPlotsAsync = async (algorithm, config) => {
  const algorithmConfig = {
    ...config,
    optimizationAlgorithm: algorithm
  };
  
  const response = await fetch(`${API_BASE}/api/simulate/async`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(algorithmConfig)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server responded with ${response.status} for ${algorithm}: ${errorText}`);
  }
  
  return response.json();
};

/**
 * check plot generation status
 */
export const getPlotStatus = async (trackingId) => {
  const response = await fetch(`${API_BASE}/api/simulate/plot-status/${trackingId}`);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get plot status: ${errorText}`);
  }
  
  return response.json();
};

/**
 * get completed plot results
 */
export const getPlotResults = async (trackingId) => {
  const response = await fetch(`${API_BASE}/api/simulate/plot-results/${trackingId}`);
  
  if (response.status === 202) {
    // plots not ready yet
    const data = await response.json();
    return { ready: false, ...data };
  }
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get plot results: ${errorText}`);
  }
  
  const data = await response.json();
  return { ready: true, ...data };
};

/**
 * normal run of statistics
 */
export const compare = async (config) => {
  const response = await fetch(`${API_BASE}/api/compare`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(config)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Comparison failed: ${errorText}`);
  }
  
  return response.json();
};

/**
 * for the statistic metrics
 */
export const compareWithFile = async (config, file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  Object.entries(config).forEach(([key, value]) => {
    formData.append(key, value);
  });
  
  const response = await fetch(`${API_BASE}/api/compare-with-file`, {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Comparison failed: ${errorText}`);
  }
  
  return response.json();
};