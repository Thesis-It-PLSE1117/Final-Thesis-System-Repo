import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { itemVariants, inputVariants } from './workloadModelConstants';

const BurstyModel = ({ onChange }) => {
  const fields = [
    { label: "Burst Count", value: 3, key: 'burstCount' },
    { label: "Jobs per Burst", value: 50, key: 'jobsPerBurst' },
    { label: "Burst Duration (s)", value: 3600, key: 'burstDuration' },
    { label: "Quiet Duration (s)", value: 7200, key: 'quietDuration' }
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
            <Activity size={16} className="text-[#319694]" />
            {field.label}
          </label>
          <motion.input
            type="number"
            min="1"
            value={field.value}
            onChange={e => onChange(`models.bursty.${field.key}`, parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-[#319694]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#319694]/30 focus:border-[#319694]/50 transition-all"
            whileFocus="focus"
            variants={inputVariants}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default BurstyModel;