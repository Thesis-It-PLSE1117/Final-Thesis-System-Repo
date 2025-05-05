import { motion } from 'framer-motion';
import { Cpu, Zap, Code, TestTube2, FlaskConical, GitCompare } from 'lucide-react';

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#267b79]/20 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: -20, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        className={`relative bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border-t-4 ${isEACO ? 'border-[#319694]' : 'border-[#4fd1c5]'}`}
      >
        <div className="flex items-start gap-4 mb-6">
          <div className={`p-3 rounded-lg ${bgColor} ${textColor}`}>
            <Cpu size={24} />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${textColor}`}>{algorithm.name}</h2>
            <div className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              <FlaskConical className="mr-1 h-3 w-3" />
              Research Version
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className={`p-4 ${bgColor} rounded-lg border ${isEACO ? 'border-[#319694]/20' : 'border-[#4fd1c5]/20'}`}>
            <h3 className="font-semibold flex items-center gap-2 mb-2">
              <Zap className={`${textColor}`} size={18} />
              Enhancement Approach
            </h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              {algorithm.enhancements.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                <Code className="text-gray-500" size={18} />
                Key Parameters
              </h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                {algorithm.parameters.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                <TestTube2 className="text-gray-500" size={18} />
                Research Focus
              </h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                {algorithm.researchFocus.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
              <GitCompare className="text-gray-500" size={18} />
              Expected Benefits
            </h3>
            <p className="text-gray-700 pl-6">
              This enhanced version is designed to improve {isEACO ? "dynamic workload adaptation" : "convergence speed"} in cloud environments. Actual performance metrics will be determined through simulation.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className={`mt-8 px-4 py-2 bg-gradient-to-r ${accentColor} ${isEACO ? 'to-[#4fd1c5]' : 'to-[#319694]'} text-white rounded-lg hover:opacity-90 transition-opacity shadow-md`}
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
};

export default AlgorithmModal;