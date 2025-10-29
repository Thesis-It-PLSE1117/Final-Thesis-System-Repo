import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";
import { useState, useRef } from "react";
import {
  ICON_SIZES,
  INPUT_SIZES,
  CARD_SIZES,
} from "../../constants/designSystem";

const ConfigRecommendations = {
  numHosts: "Recommended: 4-8 hosts (start small for testing)",
  numPesPerHost: "Recommended: 4-16 cores per host",
  peMips: "Recommended: 1000-3000 MIPS per core",
  ramPerHost: "Recommended: 8192-32768 MB (8GB-32GB)",
  bwPerHost: "Recommended: 10000-20000 MBps network bandwidth",
  storagePerHost: "Recommended: 1-2TB (1000000-2000000 MB)",
  numVMs: "Recommended: 10-50 VMs (should exceed host count)",
  vmMips: "Recommended: 500-2000 MIPS (less than host PE MIPS)",
  vmPes: "Recommended: 1-4 virtual CPUs per VM",
  vmRam: "Recommended: 512-4096 MB memory per VM",
  vmBw: "Recommended: 1000-5000 MBps bandwidth per VM",
  vmSize: "Recommended: 10-50GB (10000-50000 MB) storage per VM",
};

const InputField = ({
  label,
  name,
  value,
  onChange,
  icon: Icon,
  unit,
  min = 1,
  disabled = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const inputRef = useRef(null);

  return (
    <div className="relative mb-4">
      <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
        {Icon && (
          <div className="p-1 mr-1.5 bg-[#319694]/10 rounded-md">
            <Icon className="text-[#319694]" size={ICON_SIZES.xs} />
          </div>
        )}
        <span className="text-gray-700 text-sm">{label}</span>
      </label>

      <div className="relative">
        <input
          ref={inputRef}
          type="number"
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          min={min}
          className={`
            w-full pl-8 pr-10 py-2 text-sm border rounded-lg
            transition-all duration-200 shadow-sm
            ${
              disabled
                ? "border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                : "border-gray-200 bg-white focus:ring-2 focus:ring-[#319694]/50 focus:border-[#319694]/30"
            }
          `}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
        />

        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
          {Icon && <Icon className="text-gray-400" size={ICON_SIZES.xs} />}
        </div>

        <div className="absolute inset-y-0 right-0 flex items-center pr-2.5">
          {unit && (
            <span className="text-gray-500 text-sm font-medium mr-1.5">
              {unit}
            </span>
          )}
          <div
            className="cursor-help"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Info
              className="text-gray-400 hover:text-[#319694] transition-colors"
              size={ICON_SIZES.xs}
            />
          </div>
        </div>

        <AnimatePresence>
          {showTooltip && (
            <motion.div
              className="absolute z-[9999] left-0 right-0"
              style={{
                bottom: "-48px", // Reduced distance from input
              }}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
            >
              <div className="p-1.5 bg-white rounded-lg shadow-lg border border-gray-200 text-sm">
                <div className="flex items-start gap-1.5">
                  <Info
                    className="flex-shrink-0 text-[#319694] mt-0.5"
                    size={12}
                  />
                  <p className="text-gray-600 leading-relaxed">
                    {ConfigRecommendations[name]}
                  </p>
                </div>
                <div className="absolute -top-2 left-5 w-2 h-2 bg-white transform rotate-45 border-t border-l border-gray-200" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InputField;
