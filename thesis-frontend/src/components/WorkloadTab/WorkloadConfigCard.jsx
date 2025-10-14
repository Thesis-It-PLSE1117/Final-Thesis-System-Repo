import { motion } from "framer-motion";
import { Zap, Server, FileText, Database } from "lucide-react";

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const WorkloadConfigCard = ({
  config,
  onChange,
  csvRowCount,
  onPresetSelect,
  selectedPreset,
  presetOptions = [],
  cloudletToggleEnabled,
  defaultCloudletCount,
}) => {
  const hasWorkload =
    csvRowCount > 0 || (selectedPreset && selectedPreset !== "");

  // Always disable when cloudlet toggle is off, regardless of workload
  const isDisabled = false;

  const inputClasses = `w-full px-4 py-2 border rounded-lg focus:outline-none transition-all ${
    !isDisabled
      ? "border-[#319694]/20 focus:ring-2 focus:ring-[#319694]/30 focus:border-[#319694]/50"
      : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
  }`;

  const handleInputChange = (e) => {
    if (!isDisabled) {
      onChange(e);
    }
  };

  return (
    <motion.div
      className={`backdrop-blur-sm p-6 rounded-xl shadow-md transition-all duration-300 ${
        selectedPreset
          ? "bg-gradient-to-br from-[#319694]/5 to-[#4fd1c5]/5 border-2 border-[#319694]/30 ring-1 ring-[#319694]/10"
          : "bg-white/90 border border-gray-200"
      }`}
      variants={itemVariants}
      initial="hidden"
      animate="show"
      whileHover={{
        y: -3,
        boxShadow: "0 10px 25px -5px rgba(49, 150, 148, 0.1)",
        transition: { duration: 0.2 },
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#319694]/10 rounded-lg">
          <Zap className="text-[#319694]" size={20} />
        </div>
        <div>
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#267b79] to-[#4fd1c5]">
            Simulation Workload Setup
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            Configure cloudlets (tasks) for algorithm evaluation using Google
            cluster traces
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Server size={18} className="text-[#319694]" />
            Cloudlets (Tasks) to Schedule
          </label>
          <input
            type="number"
            name="numCloudlets"
            value={config.numCloudlets} // Always show the actual config value
            onChange={handleInputChange}
            className={inputClasses}
            min="1"
            max={csvRowCount > 0 ? csvRowCount : undefined}
            disabled={isDisabled}
          />
          {csvRowCount > 0 ? (
            <motion.p
              className="text-xs text-gray-500 mt-2 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Database size={14} className="text-[#319694]" />
              Max cloudlets (tasks) based on workload: {csvRowCount}
            </motion.p>
          ) : (
            isDisabled && (
              <motion.p
                className="text-xs text-gray-500 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Using: {config.numCloudlets} cloudlets. Enable toggle above to
                customize.
              </motion.p>
            )
          )}
          {!isDisabled && !hasWorkload && (
            <motion.p
              className="text-xs text-blue-500 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Custom cloudlet configuration enabled
            </motion.p>
          )}
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <FileText size={18} className="text-[#319694]" />
            Research Benchmark Dataset
            <span className="text-xs text-gray-500 font-normal">
              (Google cluster workload traces)
            </span>
          </label>
          <select
            value={selectedPreset}
            onChange={(e) => onPresetSelect(e.target.value)}
            className={`w-full p-2.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#319694]/30 transition-all duration-200 ${
              selectedPreset
                ? "bg-[#f0fdfa] border-2 border-[#319694]/40 text-[#267b79] font-medium"
                : "bg-gray-50 border border-gray-300 text-gray-700"
            }`}
          >
            {presetOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WorkloadConfigCard;
