import { motion } from 'framer-motion';

const DeleteConfirmationModal = ({ 
  onConfirm, 
  onCancel,
  fileType = 'file' 
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal content */}
      <motion.div 
        className="relative bg-white p-6 rounded-xl max-w-md w-full mx-4 shadow-xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">Confirm Removal</h3>
        <p className="text-gray-600 mb-6">
          Please confirm the removal of the {fileType}. 
          This action is permanent and cannot be reversed.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
          >
            Remove
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteConfirmationModal;