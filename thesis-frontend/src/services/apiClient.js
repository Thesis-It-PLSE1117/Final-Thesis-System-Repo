/**
 * I separate api's as a client service
 * 
 */

/**
 * API Client Service with Port Auto-Mapping
 *
 * Frontend ports map to backend ports:
 *   5173 -> 8081
 *   5174 -> 8082
 *   5175 -> 8083
 *   ...
 */

// Use environment variable for production, fallback to localhost for development
const getApiBase = () => {
  // Check for environment variable first
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Fallback to localhost with port mapping for local development
  const frontendPort = parseInt(window.location.port, 10);
  const backendPort = frontendPort >= 5173 ? 8081 + (frontendPort - 5173) : 8081;
  return `http://localhost:${backendPort}`;
};

// Final API base
export const API_BASE = getApiBase();

/**
 *
 */
export const run = async (algorithm, config, abortSignal = null) => {
  const algorithmConfig = {
    ...config,
    optimizationAlgorithm: algorithm
  };
  
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(algorithmConfig)
  };
  
  if (abortSignal) {
    fetchOptions.signal = abortSignal;
  }
  
  const startTime = Date.now();
  const response = await fetch(`${API_BASE}/api/simulate/raw`, fetchOptions);
  const executionTimeMs = Date.now() - startTime;
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server responded with ${response.status} for ${algorithm}: ${errorText}`);
  }
  
  const result = await response.json();
  return {
    ...result,
    executionTimeMs: result.executionTimeMs || executionTimeMs
  };
};

/**
 * with file
 */
export const runWithFile = async (algorithm, config, file, abortSignal = null) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const algorithmConfig = {
    ...config,
    optimizationAlgorithm: algorithm
  };
  
  Object.entries(algorithmConfig).forEach(([key, value]) => {
    formData.append(key, value);
  });
  
  const fetchOptions = {
    method: 'POST',
    body: formData
  };
  
  if (abortSignal) {
    fetchOptions.signal = abortSignal;
  }
  
  const response = await fetch(`${API_BASE}/api/run-with-file`, fetchOptions);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server responded with ${response.status} for ${algorithm}: ${errorText}`);
  }
  
  const result = await response.json();

  // prefer unified response that includes analysis when available
  if (result.analysis) {
    return {
      rawResults: result.simulationResults || result.rawResults || result,
      summary: (result.simulationResults?.summary) || (result.rawResults?.summary) || result.summary,
      analysis: result.analysis,
      plotData: result.plotData || undefined,
      plotMetadata: result.plotMetadata || undefined,
      executionTimeMs: result.executionTimeMs || undefined
    };
  }

  // processedResults shape from MATLAB
  if (result.plotData) {
    return {
      rawResults: result.rawResults || result,
      summary: result.rawResults?.summary || result.summary,
      plotData: result.plotData,
      plotMetadata: result.plotMetadata,
      executionTimeMs: result.executionTimeMs || undefined
    };
  }

  return {
    ...result,
    executionTimeMs: result.executionTimeMs || undefined
  };
};

/**
 * for iterations > 1
 */
export const runIterations = async (algorithm, config, abortSignal = null) => {
  const algorithmConfig = {
    ...config,
    optimizationAlgorithm: algorithm
  };
  
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(algorithmConfig)
  };
  
  if (abortSignal) {
    fetchOptions.signal = abortSignal;
  }
  
  const startTime = Date.now();
  const response = await fetch(`${API_BASE}/api/run-iterations`, fetchOptions);
  const executionTimeMs = Date.now() - startTime;
  
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
      isIterationResult: true,
      executionTimeMs: result.executionTimeMs || executionTimeMs
    };
  }
  
  return {
    ...result,
    executionTimeMs: result.executionTimeMs || executionTimeMs
  };
};

/**
 * run iterations (file)
 */
export const runIterationsWithFile = async (algorithm, config, file, abortSignal = null) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const algorithmConfig = {
    ...config,
    optimizationAlgorithm: algorithm
  };
  
  Object.entries(algorithmConfig).forEach(([key, value]) => {
    formData.append(key, value);
  });
  
  const fetchOptions = {
    method: 'POST',
    body: formData
  };
  
  if (abortSignal) {
    fetchOptions.signal = abortSignal;
  }
  
  const startTime = Date.now();
  const response = await fetch(`${API_BASE}/api/run-iterations-with-file`, fetchOptions);
  const executionTimeMs = Date.now() - startTime;
  
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
export const runWithPlots = async (algorithm, config, abortSignal = null) => {
  const algorithmConfig = {
    ...config,
    optimizationAlgorithm: algorithm
  };
  
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(algorithmConfig)
  };
  
  if (abortSignal) {
    fetchOptions.signal = abortSignal;
  }
  
  const response = await fetch(`${API_BASE}/api/simulate/with-plots`, fetchOptions);
  
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
  
  const result = await response.json();
  
  // Log the raw response from backend
  console.log('Backend Response (runWithPlots):', {
    result,
    plotData: result.plotData,
    plotMetadata: result.plotMetadata,
    rawResults: result.rawResults
  });

  return result;
};

/**
 * simulation with async plots - returns immediately with tracking id
 */
export const runWithPlotsAsync = async (algorithm, config, abortSignal = null) => {
  const algorithmConfig = {
    ...config,
    optimizationAlgorithm: algorithm
  };
  
  console.log('Starting async simulation for algorithm:', algorithm, 'with config:', algorithmConfig);
  
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(algorithmConfig)
  };
  
  if (abortSignal) {
    fetchOptions.signal = abortSignal;
  }
  
  const response = await fetch(`${API_BASE}/api/simulate/async`, fetchOptions);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server responded with ${response.status} for ${algorithm}: ${errorText}`);
  }
  
  const result = await response.json();
  console.log('Async Simulation Started:', {
    trackingId: result.trackingId,
    status: result.status,
    result
  });
  
  return result;
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
  
  const status = await response.json();
  console.log('Plot Generation Status:', {
    trackingId,
    status,
    isComplete: status.isComplete,
    progress: status.progress
  });
  
  return status;
};


/**
 * get completed plot results 
 */
export const getPlotResults = async (trackingId) => {
  const response = await fetch(`${API_BASE}/api/simulate/plot-results/${trackingId}`);
  
  if (response.status === 202) {
    const data = await response.json();
    return { ready: false, ...data };
  }
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get plot results: ${errorText}`);
  }
  
  const data = await response.json();

  // Use root-level plotMetadata which contains interpretations
  const plotMetadata = data.plotMetadata || [];

  return {
    ready: true,
    simulationId: data.simulationId,
    rawResults: data.rawResults,
    plotData: {
      ...data.plotData,
      plotMetadata: plotMetadata, // This now has the interpretations
      metrics: data.plotData?.metrics,
      plotPaths: data.plotData?.plotPaths,
      algorithm: data.plotData?.algorithm
    }
  };
};


/**
 * Helper to create fetch with extended timeout for long operations
 * Browser default timeout is often 5-10 minutes which is too short for large simulations
 */
const fetchWithExtendedTimeout = (url, options, timeoutMs = 7200000) => {
  // Default 2 hours for very long operations
  // We don't actually timeout the request, just warn the user
  return new Promise(async (resolve, reject) => {
    let timeoutWarningShown = false;
    let keepAliveInterval = null;
    
    
    if (url.includes('/compare')) {
      keepAliveInterval = setInterval(() => {
        fetch(`${API_BASE}/api/health`, { method: 'GET' }).catch(() => {
        });
        console.log(`[${new Date().toLocaleTimeString()}] Keep-alive ping sent to prevent timeout`);
      }, 600000); // 10 minutes
    }
    
    // Show warning after 5 minutes
    const warningTimeout = setTimeout(() => {
      timeoutWarningShown = true;
      console.warn('Simulation is taking longer than expected. Large simulations can take 30+ minutes. Please keep this tab open.');
    }, 300000); // 5 minutes
    
    try {
      const response = await fetch(url, options);
      clearTimeout(warningTimeout);
      if (keepAliveInterval) {
        clearInterval(keepAliveInterval);
        console.log('Keep-alive pings stopped - request completed');
      }
      resolve(response);
    } catch (error) {
      clearTimeout(warningTimeout);
      if (keepAliveInterval) {
        clearInterval(keepAliveInterval);
      }
      // Check if it's a real network error or timeout
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        reject(new Error('Network connection lost. The simulation may still be running on the server. Check History tab later.'));
      } else {
        reject(error);
      }
    }
  });
};

/**
 * normal run of statistics
 */
export const compare = async (config, abortSignal = null) => {
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(config)
  };
  
  if (abortSignal) {
    fetchOptions.signal = abortSignal;
  }
  
  // Use extended timeout wrapper for long operations
  const response = await fetchWithExtendedTimeout(`${API_BASE}/api/compare`, fetchOptions);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Comparison failed: ${errorText}`);
  }
  
  return response.json();
};

/**
 * for the statistic metrics
 */
export const compareWithFile = async (config, file, abortSignal = null) => {
  const formData = new FormData();
  formData.append('file', file);
  
  Object.entries(config).forEach(([key, value]) => {
    formData.append(key, value);
  });
  
  const fetchOptions = {
    method: 'POST',
    body: formData
  };
  
  if (abortSignal) {
    fetchOptions.signal = abortSignal;
  }
  
  // Use extended timeout wrapper for long operations with files
  const response = await fetchWithExtendedTimeout(`${API_BASE}/api/compare-with-file`, fetchOptions);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Comparison failed: ${errorText}`);
  }
  
  return response.json();
};

/**
 * cancel ongoing simulation on backend
 * calls both cancel endpoints to cover all simulation types
 */
export const cancelSimulation = async () => {
  const cancelEndpoints = [
    `${API_BASE}/api/simulate/cancel`,  // for /api/simulate/* endpoints
    `${API_BASE}/api/cancel`           // for /api/compare, /api/run-iterations, etc.
  ];
  
  const results = [];
  let lastError = null;
  
  // Try both cancel endpoints to ensure all simulation types are cancelled
  for (const endpoint of cancelEndpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        results.push({ endpoint, success: true, result });
      } else {
        const errorText = await response.text();
        results.push({ endpoint, success: false, error: errorText });
      }
    } catch (error) {
      results.push({ endpoint, success: false, error: error.message });
      lastError = error;
    }
  }
  
  const anySuccess = results.some(r => r.success);
  if (anySuccess) {
    return {
      message: 'Cancellation requested',
      results: results,
      status: 'cancelled'
    };
  } else {
    // If all endpoints failed, throw the last error
    throw lastError || new Error('All cancel endpoints failed');
  }
};
