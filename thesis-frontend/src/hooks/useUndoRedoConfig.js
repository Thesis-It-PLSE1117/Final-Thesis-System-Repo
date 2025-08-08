import { useState, useEffect, useRef } from 'react';
import UndoRedoManager from '../utils/undoRedoManager';
import { showNotification } from '../components/common/ErrorNotification';

/**
 * custom hook for undo/redo functionality
 * i use this since you know for the sake of letting users undo their mistakes
 */
export const useUndoRedoConfig = (configData, onRestore) => {
  const undoRedoManager = useRef(new UndoRedoManager());
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // initialize undo/redo manager
  useEffect(() => {
    const unsubscribe = undoRedoManager.current.subscribe((state) => {
      setCanUndo(state.canUndo);
      setCanRedo(state.canRedo);
    });
    
    // i push initial state since you know for the sake of having a starting point
    undoRedoManager.current.push(configData);
    
    return unsubscribe;
  }, []);
  
  // track config changes
  useEffect(() => {
    if (undoRedoManager.current && configData) {
      undoRedoManager.current.push(configData);
    }
  }, [configData]);

  // handle undo
  const handleUndo = () => {
    const previousState = undoRedoManager.current.undo();
    if (previousState && onRestore) {
      onRestore(previousState);
      showNotification('Changes undone', 'info', 2000);
    }
  };
  
  // handle redo
  const handleRedo = () => {
    const nextState = undoRedoManager.current.redo();
    if (nextState && onRestore) {
      onRestore(nextState);
      showNotification('Changes redone', 'info', 2000);
    }
  };

  return {
    canUndo,
    canRedo,
    handleUndo,
    handleRedo
  };
};
