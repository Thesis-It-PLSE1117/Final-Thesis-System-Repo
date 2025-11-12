import { motion, AnimatePresence } from "framer-motion";
import { Info, AlertTriangle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {
  ICON_SIZES,
  INPUT_SIZES,
  CARD_SIZES,
} from "../../constants/designSystem";

const ConfigRecommendations = {
  numHosts: "Recommended: 10-20 hosts (start small for testing)",
  numPesPerHost: "Recommended: 4-16 cores per host",
  peMips: "Recommended: 1000-3000 MIPS per core",
  ramPerHost: "Recommended: 8192-32768 MB (8GB-32GB)",
  bwPerHost: "Recommended: 10000-20000 MBps network bandwidth",
  storagePerHost: "Recommended: 100GB-1TB (100000-1000000 MB)",
  numVMs: "Recommended: 10-50 VMs (should exceed host count)",
  vmMips: "Recommended: 500-2000 MIPS (less than host PE MIPS)",
  vmPes: "Recommended: 1-4 virtual CPUs per VM",
  vmRam: "Recommended: 512-4096 MB memory per VM",
  vmBw: "Recommended: 1000-5000 MBps bandwidth per VM",
  vmSize: "Recommended: 10-50GB (10000-50000 MB) storage per VM",
};

// More flexible validation rules - these are just recommendations, not hard limits
const defaultValidationRules = {
  numHosts: { min: 1, max: 100, strict: false },
  numPesPerHost: { min: 1, max: 64, strict: false },
  peMips: { min: 100, max: 10000, strict: false },
  ramPerHost: { min: 512, max: 262144, strict: false }, // Up to 256GB
  storagePerHost: { min: 100000, max: 5000000, strict: true }, // Up to 5TB
  bwPerHost: { min: 1000, max: 50000, strict: true },
  numVMs: { min: 1, max: 1000, strict: false },
  vmMips: { min: 100, max: 5000, strict: false },
  vmPes: { min: 1, max: 16, strict: false },
  vmRam: { min: 256, max: 16384, strict: false }, // Up to 16GB
  vmBw: { min: 500, max: 10000, strict: true },
  vmSize: { min: 10000, max: 200000, strict: true }, // Up to 200GB
};

const InputField = ({
  label,
  name,
  value,
  onChange,
  onValidationChange,
  icon: Icon,
  unit,
  disabled = false,
  validationRules = defaultValidationRules,
  isPresetApplied = false, // New prop to indicate preset is active
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [warning, setWarning] = useState(false);
  const [localValue, setLocalValue] = useState(value.toString());
  const inputRef = useRef(null);

  // Update local value when external value changes (e.g., from preset)
  useEffect(() => {
    setLocalValue(value.toString());
    // Clear warnings when value changes externally (preset applied)
    if (isPresetApplied) {
      setWarning(false);
    }
  }, [value, isPresetApplied]);

  // Get validation rules for this field
  const fieldRules = validationRules[name] || { min: 1, max: 1000000, strict: false };

  // Validate value and return adjusted value if needed
  const validateValue = (inputValue, isBlur = false) => {
    if (inputValue === "" || inputValue === "-" || inputValue === ".") {
      return { 
        isValid: false, 
        finalValue: fieldRules.min, 
        showWarning: isBlur // Only show warning on blur for empty values
      };
    }

    const numericValue = Number(inputValue);
    
    if (isNaN(numericValue)) {
      return { 
        isValid: false, 
        finalValue: fieldRules.min, 
        showWarning: isBlur 
      };
    }

    let finalValue = numericValue;
    let showWarning = false;

    // Only enforce limits if strict mode is enabled OR we're on blur
    // This allows presets to set values outside recommended ranges
    if (fieldRules.strict || isBlur) {
      // Check minimum value
      if (numericValue < fieldRules.min) {
        finalValue = fieldRules.min;
        showWarning = true;
      }
      
      // Check maximum value
      if (numericValue > fieldRules.max) {
        finalValue = fieldRules.max;
        showWarning = true;
      }
    } else {
      // For non-strict validation (typing), just show warning but don't adjust
      if (numericValue < fieldRules.min || numericValue > fieldRules.max) {
        showWarning = true;
        finalValue = numericValue; // Keep the original value
      }
    }

    return { isValid: true, finalValue, showWarning };
  };

  const handleInputChange = (e) => {
    const { value: inputValue } = e.target;
    
    // Update local string value for free editing
    setLocalValue(inputValue);

    // Only validate and notify parent when we have a valid number
    if (inputValue === "" || inputValue === "-" || inputValue === ".") {
      setWarning(false);
      if (onValidationChange) onValidationChange(false);
      return; // Allow empty or partial input
    }

    const validation = validateValue(inputValue, false); // Not strict during typing
    
    if (!validation.isValid) {
      setWarning(false);
      if (onValidationChange) onValidationChange(false);
      return;
    }

    // Update warning state
    if (validation.showWarning) {
      setWarning(true);
    } else {
      setWarning(false);
    }

    // Notify parent about validation result
    if (onValidationChange) {
      onValidationChange(validation.showWarning);
    }

    // Update parent with the numeric value (even if out of range during typing)
    onChange({
      target: {
        name,
        value: validation.finalValue,
      },
    });
  };

  const handleBlur = (e) => {
    const validation = validateValue(localValue, true); // Strict on blur
    
    if (!validation.isValid || validation.showWarning) {
      // Set to validated value if invalid or out of bounds
      const finalValue = validation.finalValue;
      setLocalValue(finalValue.toString());
      
      // Show warning for auto-correction
      if (validation.showWarning) {
        setWarning(true);
        setTimeout(() => setWarning(false), 3000);
      }
      
      // Notify parent about validation result
      if (onValidationChange) {
        onValidationChange(validation.showWarning);
      }

      // Update parent with validated value
      onChange({
        target: {
          name,
          value: finalValue,
        },
      });
    }
    
    setShowTooltip(false);
  };

  const handleFocus = () => {
    setShowTooltip(true);
  };

  // Generate warning message based on field name
  const getWarningMessage = () => {
    const rules = fieldRules;
    if (fieldRules.strict) {
      return `Value adjusted to required range: ${rules.min.toLocaleString()}-${rules.max.toLocaleString()}${unit ? ' ' + unit : ''}`;
    } else {
      return `Value outside recommended range: ${rules.min.toLocaleString()}-${rules.max.toLocaleString()}${unit ? ' ' + unit : ''}`;
    }
  };

  return (
    <div className="relative mb-4">
      {/* Label with integrated tooltip trigger */}
      <div className="flex items-center justify-between mb-1">
        <label className="flex items-center text-sm font-medium text-gray-700">
          {Icon && (
            <div className="p-1 mr-1.5 bg-[#319694]/10 rounded-md">
              <Icon className="text-[#319694]" size={ICON_SIZES.xs} />
            </div>
          )}
          <span className="text-gray-700 text-sm">{label}</span>
        </label>
        
        {/* Info button that triggers tooltip */}
        <button
          type="button"
          className="p-1 text-gray-400 hover:text-[#319694] transition-colors cursor-help"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setShowTooltip(!showTooltip)}
        >
          <Info size={ICON_SIZES.xs} />
        </button>
      </div>

      {/* Tooltip positioned absolutely above the entire field */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            className="absolute z-50 left-0 right-0 -top-2 transform -translate-y-full"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl mb-2 mx-2">
              <div className="flex items-start gap-2">
                <Info className="flex-shrink-0 text-[#319694] mt-0.5" size={14} />
                <p className="leading-relaxed">
                  {ConfigRecommendations[name]}
                </p>
              </div>
              {/* Arrow pointing down */}
              <div className="absolute bottom-0 left-6 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input field */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          name={name}
          value={localValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          disabled={disabled}
          className={`
            w-full pl-8 pr-10 py-2 text-sm border rounded-lg
            transition-all duration-200 shadow-sm
            ${
              disabled
                ? "border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                : warning
                ? "border-amber-300 bg-amber-50 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/30"
                : "border-gray-200 bg-white focus:ring-2 focus:ring-[#319694]/50 focus:border-[#319694]/30"
            }
          `}
        />

        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
          {Icon && <Icon className="text-gray-400" size={ICON_SIZES.xs} />}
        </div>

        {unit && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-gray-500 text-sm font-medium">
              {unit}
            </span>
          </div>
        )}
      </div>

      {/* Warning message */}
      <AnimatePresence>
        {warning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center mt-1 p-2 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-xs"
          >
            <AlertTriangle size={14} className="mr-2 flex-shrink-0" />
            <span>{getWarningMessage()}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InputField;