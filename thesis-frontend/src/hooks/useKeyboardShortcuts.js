import { useEffect } from 'react';

/**
 * Custom hook for keyboard shortcuts
 */
export const useKeyboardShortcuts = (shortcuts, dependencies = []) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      const ctrl = event.ctrlKey ? 'ctrl+' : '';
      const alt = event.altKey ? 'alt+' : '';
      const shift = event.shiftKey ? 'shift+' : '';
      
      const combination = `${ctrl}${alt}${shift}${key}`;
      

      if (shortcuts[combination]) {
        event.preventDefault();
        shortcuts[combination](event);
      }
      

const activeElement = document.activeElement;
      if (activeElement.tagName.toLowerCase() !== 'input' && !ctrl && !alt && !shift && key >= '1' && key <= '9') {
        if (shortcuts[`num${key}`]) {
          event.preventDefault();
          shortcuts[`num${key}`](event);
        }
      }
    };


    window.addEventListener('keydown', handleKeyDown);
    

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [...dependencies]);
};


export const KEYBOARD_SHORTCUTS = {
  NAVIGATION: {
    'num1': 'Go to Data Center tab',
    'num2': 'Go to Workload tab',
    'num3': 'Go to Iterations tab',
    'num4': 'Go to History tab',
    'num5': 'Go to Help tab',
    'alt+left': 'Go to previous tab',
    'alt+right': 'Go to next tab',
  },
  ACTIONS: {
    'ctrl+enter': 'Run simulation',
    'ctrl+s': 'Save configuration',
    'ctrl+o': 'Load configuration',
    'ctrl+z': 'Undo last change',
    'ctrl+y': 'Redo last change',
    'escape': 'Close modal/Cancel action',
    '?': 'Show keyboard shortcuts help',
  },
  SIMULATION: {
    'space': 'Play/Pause animation',
    'r': 'Reset animation',
    'left': 'Previous frame',
    'right': 'Next frame',
  }
};
