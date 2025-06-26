import { motion } from 'framer-motion';
import { Activity, Clock } from 'lucide-react';
import { itemVariants, inputVariants } from './workloadModelConstants';

const GoogleLikeModel = ({ onChange }) => {
  return (
    <div className="space-y-4">
      <motion.div variants={itemVariants}>
        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
          <Activity size={16} className="text-[#319694]" />
          Scheduling Class Distribution
        </h4>
        {[0, 1, 2, 3].map(i => (
          <motion.div 
            key={i} 
            className="flex items-center mb-3 gap-3"
            variants={itemVariants}
            transition={{ delay: i * 0.05 }}
          >
            <label className="w-24 text-sm text-gray-600">Class {i}:</label>
            <motion.input
              type="number"
              step="0.1"
              min="0"
              max="1"
              value={i === 3 ? 0 : i === 0 ? 0.7 : i === 1 ? 0.2 : 0.1}
              onChange={e => {
                const newDist = [0.7, 0.2, 0.1, 0];
                newDist[i] = parseFloat(e.target.value);
                onChange('models.google-like.schedulingClassDistribution', newDist);
              }}
              className="flex-1 px-3 py-2 border border-[#319694]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#319694]/30 focus:border-[#319694]/50 transition-all"
              whileFocus="focus"
              variants={inputVariants}
            />
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
          <Clock size={16} className="text-[#319694]" />
          Arrival Pattern
        </h4>
        <motion.select
          value="poisson"
          onChange={e => onChange('models.google-like.arrivalPattern', e.target.value)}
          className="w-full px-4 py-2 border border-[#319694]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#319694]/30 focus:border-[#319694]/50 transition-all"
          whileFocus="focus"
          variants={inputVariants}
        >
          <option value="poisson">Poisson Process</option>
          <option value="uniform">Uniform</option>
        </motion.select>
      </motion.div>
    </div>
  );
};

export default GoogleLikeModel;