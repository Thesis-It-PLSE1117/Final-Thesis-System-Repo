import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { itemVariants, inputVariants } from './workloadModelConstants';

const PeriodicModel = ({ onChange }) => {
  const fields = [
    { label: "Period (seconds)", value: 14400, key: 'period' },
    { label: "Jobs per Period", value: 30, key: 'jobsPerPeriod' },
    { label: "Jitter (%)", value: 20, key: 'jitter', transform: v => parseFloat(v) / 100 },
    { label: "Phase Shift (seconds)", value: 0, key: 'phaseShift' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fields.map((field, i) => (
        <motion.div 
          key={field.key}
          variants={itemVariants}
          transition={{ delay: i * 0.1 }}
        >
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Clock size={16} className="text-[#319694]" />
            {field.label}
          </label>
          <motion.input
            type="number"
            min={field.key === 'jitter' ? 0 : 1}
            max={field.key === 'jitter' ? 100 : undefined}
            step={field.key === 'jitter' ? 1 : undefined}
            defaultValue={field.value}
            onChange={e => onChange(
              `models.periodic.${field.key}`,
              field.transform ? field.transform(e.target.value) : parseInt(e.target.value)
            )}
            className="w-full px-4 py-2 border border-[#319694]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#319694]/30 focus:border-[#319694]/50 transition-all"
            whileFocus="focus"
            variants={inputVariants}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default PeriodicModel;