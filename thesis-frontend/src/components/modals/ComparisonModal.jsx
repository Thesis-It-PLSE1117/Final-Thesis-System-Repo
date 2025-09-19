import { motion } from "framer-motion";
import {
  GitCompare,
  ClipboardList,
  BarChart2,
  AlertTriangle,
  X,
} from "lucide-react";

const ComparisonModal = ({ isOpen, onClose, comparison }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#267b79]/20 backdrop-blur-sm px-3 sm:px-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -20, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        className="relative bg-white rounded-xl shadow-xl p-4 sm:p-6 md:p-8 max-w-full sm:max-w-2xl md:max-w-4xl w-full max-h-[90vh] overflow-y-auto border-t-4 border-[#319694]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 sm:hidden"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6 sm:mb-8">
          <div className="p-2.5 sm:p-3 rounded-lg bg-[#319694]/10 text-[#319694] flex-shrink-0 self-start">
            <GitCompare size={20} className="sm:size-6" />
          </div>
          <div className="pr-6 sm:pr-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 leading-tight">
              {comparison.title}
            </h2>
            <div className="inline-flex items-center mt-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-100 text-gray-600">
              <AlertTriangle className="mr-1.5 size-3.5" />
              Theoretical Framework
            </div>
            <p className="mt-3 text-gray-600 text-sm sm:text-base">
              Comparison of algorithmic approaches under investigation
            </p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mb-6 sm:mb-8 overflow-hidden rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 w-[25%]">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="text-gray-400" size={16} />
                      Aspect
                    </div>
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-800 w-[25%]">
                    Enhanced ACO
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-800 w-[25%]">
                    Enhanced PSO
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 w-[25%]">
                    Research Focus
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white text-sm sm:text-base">
                {comparison.metrics.map((metric, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-gray-800">
                      {metric.name}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="text-gray-600 font-medium">
                        {metric.aco}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="text-gray-600 font-medium">
                        {metric.pso}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-600 text-xs sm:text-sm leading-relaxed">
                      {metric.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Methodology Section */}
        <div className="p-4 sm:p-6 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <div className="p-2 rounded-lg bg-gray-200 text-gray-600">
              <BarChart2 size={18} />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">
              Research Methodology
            </h3>
          </div>

          <ul className="space-y-2 sm:space-y-3 pl-1">
            {comparison.recommendations.map((item, index) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0 mt-1 mr-2 sm:mr-3 w-5 h-5 rounded-full bg-[#319694]/10 text-[#319694] flex items-center justify-center text-xs">
                  {index + 1}
                </div>
                <span className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Centered Close Button */}
        <div className="mt-6 sm:mt-8 flex justify-center">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#319694] to-[#4fd1c5] text-white rounded-lg hover:opacity-90 transition-opacity shadow-md font-medium text-sm sm:text-base"
          >
            Close Comparison
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ComparisonModal;