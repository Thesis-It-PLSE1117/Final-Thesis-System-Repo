import { motion } from 'framer-motion';
import { AlertTriangle, FileUp, Trash2 } from 'lucide-react';

export const DeleteConfirmationDialog = ({ showDeleteConfirm, setShowDeleteConfirm, handleDeleteEntry }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={() => setShowDeleteConfirm(null)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Delete Simulation</h3>
        <p className="text-gray-600 mb-5 text-sm">
          Are you sure you want to delete this simulation and its paired results? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowDeleteConfirm(null)}
            className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDeleteEntry(showDeleteConfirm)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const ImportDialog = ({ showImportDialog, setShowImportDialog, handleImportHistory }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={() => setShowImportDialog(false)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Import Saved Result</h3>
        <p className="text-gray-600 mb-4 text-sm">
          Select a downloaded file to import. This will add the imported data to your existing saved results.
        </p>
        <input
          type="file"
          accept=".json"
          onChange={handleImportHistory}
          className="w-full mb-5 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#319694] file:text-white hover:file:bg-[#267b79] transition-colors"
        />
        <div className="flex justify-end">
          <button
            onClick={() => setShowImportDialog(false)}
            className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const ImportConfirmationDialog = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileUp className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Import Saved Result Data</h3>
            <p className="text-sm text-gray-500 mt-1 font-semibold">Confirm import action</p>
          </div>
        </div>
        <p className="text-gray-600 mb-5 text-sm">
          This will add the imported data to your existing saved results. Your current saved results will be preserved, and the new entries will be merged in.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#319694] text-white rounded-lg hover:bg-[#267b79] text-sm font-medium transition-colors"
          >
            Continue
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const ClearHistoryConfirmationDialog = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle className="text-red-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Clear All Saved Results</h3>
            <p className="text-sm text-gray-500 mt-1">This action cannot be undone</p>
          </div>
        </div>
        <p className="text-gray-600 mb-2 text-sm font-semibold">
          Are you sure you want to clear all saved results? This will permanently delete:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-600 mb-5 space-y-1 ml-2">
          <li>All simulation runs and results</li>
          <li>EACO and EPSO algorithm data</li>
          <li>Configuration snapshots</li>
          <li>Statistical analysis results</li>
        </ul>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-5">
          <p className="text-sm text-yellow-800">
            <strong>Tip:</strong> Consider exporting your data before clearing if you need a backup.
          </p>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Trash2 size={16} />
            Clear All
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
