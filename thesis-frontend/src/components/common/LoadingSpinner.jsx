import { motion } from "framer-motion";

export const LoadingSpinner = ({ message = "Loading...", size = "medium" }) => {
  const sizeClasses = {
    small: "h-8 w-8",
    medium: "h-12 w-12",
    large: "h-16 w-16"
  };

  const textSizes = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg"
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col items-center justify-center p-8"
    >
      <div className="flex items-center justify-center">
        <div
          className={`animate-spin rounded-full border-b-2 border-[#319694] ${sizeClasses[size]}`}
        ></div>
      </div>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`mt-4 text-gray-600 text-center ${textSizes[size]}`}
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
};


export const LoadingOverlay = ({ message = "Processing..." }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center" // Increased z-index
    >
      <div className="bg-white rounded-xl p-8 shadow-lg max-w-sm mx-4">
        <LoadingSpinner message={message} size="medium" />
      </div>
    </motion.div>
  );
};