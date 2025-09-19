import { motion } from 'framer-motion';
import { Cpu, Zap, Code, TestTube2, FlaskConical, GitCompare, X } from 'lucide-react';

const AlgorithmModal = ({ isOpen, onClose, algorithm }) => {
  if (!isOpen) return null;

  const isEACO = algorithm.name.includes("ACO");
  const accentColor = isEACO ? "from-[#319694]" : "from-[#4fd1c5]";
  const textColor = isEACO ? "text-[#319694]" : "text-[#4fd1c5]";
  const bgColor = isEACO ? "bg-[#319694]/10" : "bg-[#4fd1c5]/10";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-3 sm:px-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        className="relative bg-white rounded-xl p-4 sm:p-6 w-full max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 sm:hidden"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-4 mb-4 sm:mb-6">
          <div className={`p-2.5 sm:p-3 rounded-lg ${bgColor} ${textColor}`}>
            <Cpu className="size-5 sm:size-6" />
          </div>
          <div className="pr-6 sm:pr-0">
            <h2 className={`text-xl sm:text-2xl font-bold ${textColor}`}>{algorithm.name}</h2>
            <div className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              <FlaskConical className="mr-1 size-3" />
              Research Version
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className={`p-3 sm:p-4 ${bgColor} rounded-lg border ${isEACO ? 'border-[#319694]/20' : 'border-[#4fd1c5]/20'}`}>
            <h3 className="font-semibold flex items-center gap-2 mb-2 text-sm sm:text-base">
              <Zap className={`${textColor} size-4 sm:size-5`} />
              Enhancement Approach
            </h3>
            <ul className="list-disc pl-5 sm:pl-6 space-y-1 text-gray-700 text-xs sm:text-sm">
              {algorithm.enhancements.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-2 text-sm sm:text-base">
                <Code className="text-gray-500 size-4 sm:size-5" />
                Key Parameters
              </h3>
              <ul className="list-disc pl-5 sm:pl-6 space-y-1 text-gray-700 text-xs sm:text-sm">
                {algorithm.parameters.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-2 text-sm sm:text-base">
                <TestTube2 className="text-gray-500 size-4 sm:size-5" />
                Research Focus
              </h3>
              <ul className="list-disc pl-5 sm:pl-6 space-y-1 text-gray-700 text-xs sm:text-sm">
                {algorithm.researchFocus.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-2 text-sm sm:text-base">
              <GitCompare className="text-gray-500 size-4 sm:size-5" />
              Expected Benefits
            </h3>
            <p className="text-gray-700 text-xs sm:text-sm">
              This enhanced version is designed to improve {isEACO ? "dynamic workload adaptation" : "convergence speed"} in cloud environments. Actual performance metrics will be determined through simulation.
            </p>
          </div>
        </div>

        {/* Centered Close Button */}
        <div className="mt-6 sm:mt-8 flex justify-center">
          <button
            onClick={onClose}
            className={`w-full sm:w-auto px-6 py-3 bg-gradient-to-r ${accentColor} ${isEACO ? 'to-[#4fd1c5]' : 'to-[#319694]'} text-white rounded-lg hover:opacity-90 transition-opacity shadow-md text-sm sm:text-base font-medium`}
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AlgorithmModal;