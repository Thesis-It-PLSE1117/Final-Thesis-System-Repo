import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
  
const ProgressSteps = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="w-full px-8 py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isClickable = onStepClick && (isCompleted || index === currentStep);

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step */}
              <div className="relative">
                <motion.button
                  className={`
                    relative z-10 w-10 h-10 rounded-full flex items-center justify-center
                    transition-all duration-200 font-medium text-sm
                    ${isCompleted ? 'bg-[#319694] text-white' : ''}
                    ${isActive ? 'bg-[#319694] text-white ring-4 ring-[#319694]/20' : ''}
                    ${!isCompleted && !isActive ? 'bg-gray-200 text-gray-500' : ''}
                    ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
                  `}
                  onClick={() => isClickable && onStepClick(index)}
                  disabled={!isClickable}
                  whileHover={isClickable ? { scale: 1.05 } : {}}
                  whileTap={isClickable ? { scale: 0.95 } : {}}
                >
                  {isCompleted ? (
                    <Check size={16} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </motion.button>

                <div className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <p className={`text-xs font-medium ${
                    isActive || isCompleted ? 'text-gray-700' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </p>
                  {step.sublabel && (
                    <p className="text-xs text-gray-400 text-center mt-0.5">
                      {step.sublabel}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-2">
                  <div className="relative h-0.5 bg-gray-200">
                    <motion.div
                      className="absolute h-full bg-[#319694]"
                      initial={{ width: 0 }}
                      animate={{ width: isCompleted ? '100%' : '0%' }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressSteps;
