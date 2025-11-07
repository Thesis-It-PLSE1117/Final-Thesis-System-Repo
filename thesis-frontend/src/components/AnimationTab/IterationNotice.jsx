import { motion } from "framer-motion";

export const IterationNotice = ({ onViewResults, onBack }) => (
  <div className="flex items-center justify-center min-h-screen p-4 sm:p-6">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center w-full max-w-md sm:max-w-lg text-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-dashed border-blue-200 p-6 sm:p-8 shadow-lg"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-4 sm:p-6 rounded-full shadow-lg mb-6 sm:mb-8"
      >
        <svg 
          className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      </motion.div>

      <motion.h4 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.3 }} 
        className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4"
      >
        Animation Not Available
      </motion.h4>

      <motion.p 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.4 }} 
        className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-xs sm:max-w-sm px-2 leading-relaxed"
      >
        Animation works with single runs only. Your current results come from multiple runs. View the results tab instead.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.5 }} 
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-xs sm:max-w-sm px-2"
      >
        <ActionButton 
          onClick={onViewResults} 
          variant="primary" 
          icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        >
          View Results
        </ActionButton>
        
        <ActionButton 
          onClick={onBack} 
          variant="secondary" 
          icon="M10 19l-7-7m0 0l7-7m-7 7h18"
        >
          Back to Config
        </ActionButton>
      </motion.div>
    </motion.div>
  </div>
);

const ActionButton = ({ onClick, variant, icon, children }) => {
  const baseClasses = "px-5 sm:px-6 py-3 rounded-lg hover:shadow-md transition-all flex items-center justify-center text-sm sm:text-base font-medium w-full sm:w-auto";
  const variants = {
    primary: "bg-gradient-to-r from-[#319694] to-[#2a827f] text-white hover:from-[#2a827f] hover:to-[#236c6a]",
    secondary: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
  };

  return (
    <motion.button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]}`}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
    >
      <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
      </svg>
      <span className="whitespace-nowrap">{children}</span>
    </motion.button>
  );
};