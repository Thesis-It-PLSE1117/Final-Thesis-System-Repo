import { motion } from 'framer-motion';

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
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Import History</h3>
        <p className="text-gray-600 mb-4 text-sm">
          Select a downloaded file to import. This will add the imported data to your existing history.
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
