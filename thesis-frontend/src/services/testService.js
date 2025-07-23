// Base URL for backend API
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

/**
 * Check the status of MATLAB engine
 * @returns {Promise} Response containing MATLAB status
 */
export const getMatlabStatus = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/test/matlab-status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error checking MATLAB status:', error);
    // Return a default error state
    return {
      data: {
        available: false,
        engineReady: false,
        error: error.message
      }
    };
  }
};
