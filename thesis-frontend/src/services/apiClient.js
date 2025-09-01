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

// Determine frontend port
const frontendPort = parseInt(window.location.port, 10);

// Auto-map: backendPort = 8081 + (frontendPort - 5173)
const backendPort = frontendPort >= 5173 ? 8081 + (frontendPort - 5173) : 8081;

// Final API base
export const API_BASE = `http://localhost:${backendPort}`;

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
  

  const response = await fetch(`${API_BASE}/api/simulate/raw`, fetchOptions);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server responded with ${response.status} for ${algorithm}: ${errorText}`);
  }
  
  return response.json();
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
      plotMetadata: result.plotMetadata || undefined
    };
  }

  // processedResults shape from MATLAB
  if (result.plotData) {
    return {
      rawResults: result.rawResults || result,
      summary: result.rawResults?.summary || result.summary,
      plotData: result.plotData,
      plotMetadata: result.plotMetadata
    };
  }

  // Raw SimulationResults
  return result;
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
  
  const response = await fetch(`${API_BASE}/api/run-iterations`, fetchOptions);
  
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
  
  const response = await fetch(`${API_BASE}/api/run-iterations-with-file`, fetchOptions);
  
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

  // Debug the metadata structure
  console.log('Plot Metadata Structure:', {
    rootMetadata: data.plotMetadata,
    plotDataMetadata: data.plotData?.plotMetadata,
    hasRootMetadata: !!data.plotMetadata,
    hasPlotDataMetadata: !!data.plotData?.plotMetadata,
    rootMetadataLength: data.plotMetadata?.length || 0,
    plotDataMetadataLength: data.plotData?.plotMetadata?.length || 0
  });
  
  // CORRECTED: Use root-level plotMetadata which contains interpretations
  const plotMetadata = data.plotMetadata || [];
  
  console.log('Selected plotMetadata:', plotMetadata);

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
  
  const response = await fetch(`${API_BASE}/api/compare`, fetchOptions);
  
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
  
  const response = await fetch(`${API_BASE}/api/compare-with-file`, fetchOptions);
  
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
        console.log(`Cancel request successful for ${endpoint}:`, result);
      } else {
        const errorText = await response.text();
        results.push({ endpoint, success: false, error: errorText });
        console.warn(`Cancel request failed for ${endpoint}: ${errorText}`);
      }
    } catch (error) {
      results.push({ endpoint, success: false, error: error.message });
      console.warn(`Cancel request error for ${endpoint}:`, error.message);
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
