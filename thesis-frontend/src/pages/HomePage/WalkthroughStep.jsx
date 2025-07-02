import { motion } from 'framer-motion';
import { Circle, ChevronRight, ArrowRight } from 'lucide-react';

const WalkthroughStep = ({ step, index }) => {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start relative"
      initial={{ opacity: 0.8 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="flex justify-center md:justify-end relative">
        <div className="relative">
          <div className="bg-gradient-to-br from-[#319694] to-[#4fd1c5] p-5 rounded-full text-white shadow-lg relative z-10 flex items-center justify-center">
            <span className="text-xl font-bold block">
              {index + 1}
            </span>
          </div>
        </div>
      </div>
      
      <motion.div 
        className="md:col-span-4 bg-gradient-to-br from-[#f0fdfa] to-white p-8 rounded-2xl shadow-lg border border-[#319694]/20 relative overflow-hidden group"
        whileHover={{ 
          y: -4,
          boxShadow: "0 10px 25px -5px rgba(49, 150, 148, 0.3)"
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-[#319694] to-[#4fd1c5]"
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        />
        
        <div>
          <h4 className="text-2xl font-bold text-[#319694] mb-4 flex items-center gap-3">
            {step.title}
            <motion.span
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <ArrowRight size={20} className="text-[#4fd1c5]" />
            </motion.span>
          </h4>
          
          <div className="space-y-4 text-gray-700">
            {step.content.map((p, i) => (
              <motion.p 
                key={i}
                className="text-lg"
                initial={{ opacity: 0.9 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                {p}
              </motion.p>
            ))}
            
            {step.list && (
              <ul className="list-disc pl-6 space-y-3">
                {step.list.map((item, i) => (
                  <li 
                    key={i}
                    className="flex items-start gap-3 text-lg"
                  >
                    <Circle className="w-3 h-3 mt-2 text-[#319694] fill-current" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WalkthroughStep;