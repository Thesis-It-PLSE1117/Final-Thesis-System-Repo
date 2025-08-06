import { useEffect, useRef, useState } from 'react';
import { showNotification } from '../components/common/ErrorNotification';
export const useAutoSave = (data, key, delay = 2000) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const timeoutRef = useRef(null);
  const previousDataRef = useRef(null);

  useEffect(() => {

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }


    if (JSON.stringify(data) === JSON.stringify(previousDataRef.current)) {
      return;
    }

    timeoutRef.current = setTimeout(() => {
      setIsSaving(true);
      
      try {
        localStorage.setItem(`autosave_${key}`, JSON.stringify({
          data,
          timestamp: new Date().toISOString()
        }));
        
        previousDataRef.current = data;
        setLastSaved(new Date());
        setIsSaving(false);
        
        // Show subtle notification
        showNotification('Configuration auto-saved', 'success', 2000);
      } catch (error) {
        setIsSaving(false);
        showNotification('Failed to auto-save configuration', 'error');
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, key, delay]);

  const loadAutoSave = () => {
    try {
      const saved = localStorage.getItem(`autosave_${key}`);
      if (saved) {
        const { data, timestamp } = JSON.parse(saved);
        return { data, timestamp };
      }
    } catch (error) {
      showNotification('Failed to load auto-saved configuration', 'error');
    }
    return null;
  };

  const clearAutoSave = () => {
    try {
      localStorage.removeItem(`autosave_${key}`);
      showNotification('Auto-saved configuration cleared', 'info', 2000);
    } catch (error) {
      showNotification('Failed to clear auto-saved configuration', 'error');
    }
  };

  return {
    isSaving,
    lastSaved,
    loadAutoSave,
    clearAutoSave
  };
};
