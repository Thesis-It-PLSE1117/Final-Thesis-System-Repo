import { Undo, Redo } from 'lucide-react';

export const UndoRedoButtons = ({ simulationState, canUndo, canRedo, handleUndo, handleRedo }) => {
  if (simulationState !== 'config') return null;
  
  return (
    <div className="fixed bottom-8 right-8 flex gap-2">
      <button
        onClick={handleUndo}
        disabled={!canUndo}
        className="bg-white shadow-lg p-3 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Undo (Ctrl+Z)"
      >
        <Undo size={20} />
      </button>
      <button
        onClick={handleRedo}
        disabled={!canRedo}
        className="bg-white shadow-lg p-3 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Redo (Ctrl+Y)"
      >
        <Redo size={20} />
      </button>
    </div>
  );
};