import { motion } from "framer-motion";
import { Zap, Server, FileText, Database } from "lucide-react";
import { useState, useEffect, useRef } from "react";

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

  // Enforce 1000-10000 range for cloudlets
  const minCloudlets = 1000;
  const maxCloudlets = 10000;
  
  // Calculate the actual max value - use the smaller of csvRowCount or 10000
  const actualMaxCloudlets = csvRowCount > 0 ? Math.min(csvRowCount, maxCloudlets) : maxCloudlets;
  
  // Local state for the input value to allow temporary invalid values during typing
  const [inputValue, setInputValue] = useState(config.numCloudlets.toString());
  const timeoutRef = useRef(null);

  // Sync local state with prop changes
  useEffect(() => {
    setInputValue(config.numCloudlets.toString());
  }, [config.numCloudlets]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const inputClasses = `w-full px-4 py-2 border rounded-lg focus:outline-none transition-all ${
    !isDisabled
      ? "border-[#319694]/20 focus:ring-2 focus:ring-[#319694]/30 focus:border-[#319694]/50"
      : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
  }`;

  const handleInputChange = (e) => {
    if (!isDisabled) {
      const { name, value } = e.target;
      setInputValue(value); // Update local state immediately

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set a new timeout to validate and apply the value after user stops typing
      timeoutRef.current = setTimeout(() => {
        let numericValue = value === "" ? minCloudlets : Number(value);
        
        // Only enforce range after typing is complete
        if (numericValue < minCloudlets) {
          numericValue = minCloudlets;
        } else if (numericValue > actualMaxCloudlets) {
          numericValue = actualMaxCloudlets;
        }
        
        // Update the local state with the validated value
        setInputValue(numericValue.toString());
        
        // Propagate the change to parent
        onChange({
          target: {
            name,
            value: numericValue,
          },
        });
      }, 800); // 800ms delay after typing stops
    }
  };

  const handleBlur = (e) => {
    // Immediate validation on blur
    const { name, value } = e.target;
    let numericValue = value === "" ? minCloudlets : Number(value);
    
    if (numericValue < minCloudlets) {
      numericValue = minCloudlets;
    } else if (numericValue > actualMaxCloudlets) {
      numericValue = actualMaxCloudlets;
    }
    
    setInputValue(numericValue.toString());
    onChange({
      target: {
        name,
        value: numericValue,
      },
    });

    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
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
          <p className="text-sm text-gray-600 mt-1">
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
            value={inputValue} // Use local state value
            onChange={handleInputChange}
            onBlur={handleBlur} // Immediate validation when user leaves the field
            className={inputClasses}
            min={minCloudlets}
            max={actualMaxCloudlets}
            disabled={isDisabled}
          />
          {csvRowCount > 0 ? (
            <motion.p
              className="text-sm text-gray-500 mt-2 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Database size={14} className="text-[#319694]" />
              Max cloudlets (tasks) based on workload: {actualMaxCloudlets.toLocaleString()}
              {/* {csvRowCount > maxCloudlets && (
                <span className="text-amber-600 ml-1">
                  (limited from {csvRowCount.toLocaleString()})
                </span>
              )} */}
            </motion.p>
          ) : (
            isDisabled && (
              <motion.p
                className="text-sm text-gray-500 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Using: {config.numCloudlets.toLocaleString()} cloudlets. Enable toggle above to
                customize.
              </motion.p>
            )
          )}
          <motion.p
            className="text-xs text-gray-400 mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Range: {minCloudlets.toLocaleString()} - {maxCloudlets.toLocaleString()} cloudlets
          </motion.p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText size={18} className="text-[#319694] inline mr-2" />
            Research Benchmark Dataset
            <span className="text-sm text-gray-500 font-normal ml-1">
              (Google cluster traces)
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