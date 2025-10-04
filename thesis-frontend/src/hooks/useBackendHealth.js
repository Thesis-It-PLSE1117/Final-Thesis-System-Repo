import { useEffect, useState } from 'react';
import { API_BASE } from '../services/apiClient';

// wake when deployed
export const useBackendHealth = () => {
  const [isHealthy, setIsHealthy] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const pingBackend = async () => {
      setIsChecking(true);
      try {
        const response = await fetch(`${API_BASE}/api/health`, {
          method: 'GET',
          timeout: 30000 // 30
        });
        
        if (response.ok) {
          setIsHealthy(true);
        } else {
          setIsHealthy(false);
        }
      } catch (error) {
        setIsHealthy(false);
      } finally {
        setIsChecking(false);
      }
    };
    pingBackend();
  }, []);

  return { isHealthy, isChecking };
};