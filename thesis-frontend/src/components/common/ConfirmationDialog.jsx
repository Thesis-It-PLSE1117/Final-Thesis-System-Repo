import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle, X } from 'lucide-react';

const ConfirmationDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type = 'warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  showCancel = true,
  children
}) => {
  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <AlertTriangle className="w-6 h-6 text-red-500" />;
      case 'info':
        return <Info className="w-6 h-6 text-[#319694]" />;
      case 'success':
        return <CheckCircle className="w-6 h-6 text-[#319694]" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-[#319694]" />;
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700';
      case 'info':
        return 'bg-[#319694] hover:bg-[#267b79]';
      case 'success':
        return 'bg-[#319694] hover:bg-[#267b79]';
      default:
        return 'bg-[#319694] hover:bg-[#267b79]';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#267b79]/20 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg mx-4"
          >
            <div className="bg-white rounded-xl shadow-xl border border-[#319694]/10">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#319694]/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#319694]/10 rounded-lg">
                    {getIcon()}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-[#319694] transition-colors p-1 rounded-lg hover:bg-[#319694]/10"
                  aria-label="Close dialog"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed">{message}</p>
                {children && <div className="mt-4">{children}</div>}
              </div>
              
              {/* Actions */}
              <div className="flex justify-end gap-3 p-6 border-t border-[#319694]/10 bg-gradient-to-r from-gray-50 to-[#e0f7f6]">
                {showCancel && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-[#319694]/30 transition-all focus:outline-none focus:ring-2 focus:ring-[#319694]/20 shadow-sm"
                  >
                    {cancelText}
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`px-6 py-2 text-white rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#319694]/30 shadow-md ${getButtonColor()}`}
                >
                  {confirmText}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationDialog;
