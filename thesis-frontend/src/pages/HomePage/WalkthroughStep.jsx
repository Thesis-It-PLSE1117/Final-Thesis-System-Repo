import { motion } from 'framer-motion';
import { Circle, ChevronRight, ArrowRight } from 'lucide-react';

const WalkthroughStep = ({ step, index }) => {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start relative"
      initial={{ x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ x: 0 }}
      transition={{ 
        delay: 0.2 + index * 0.15,
        type: "spring",
        stiffness: 100
      }}
      viewport={{ once: false, margin: "-100px" }}
    >
      <motion.div 
        className="flex justify-center md:justify-end relative"
        animate={{
          y: [0, -12, 0]
        }}
        transition={{
          duration: 3 + index * 0.3,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut'
        }}
      >
        <div className="relative">
          <motion.div
            className="absolute inset-0 bg-[#319694]/20 rounded-full blur-md"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              delay: index * 0.2
            }}
          />
          <motion.div 
            className="bg-gradient-to-br from-[#319694] to-[#4fd1c5] p-5 rounded-full text-white shadow-lg relative z-10 flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="relative">
              <motion.span 
                className="text-xl font-bold block"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 500,
                  delay: 0.3 + index * 0.1
                }}
              >
                {index + 1}
              </motion.span>
              <motion.div
                className="absolute -inset-1 rounded-full border-2 border-white/30"
                animate={{
                  scale: [1, 1.6],
                  opacity: [0.8, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div 
        className="md:col-span-4 bg-gradient-to-br from-[#f0fdfa] to-white p-8 rounded-2xl shadow-lg border border-[#319694]/20 relative overflow-hidden group"
        whileHover={{ 
          y: -8,
          boxShadow: "0 25px 50px -12px rgba(49, 150, 148, 0.4)"
        }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.div
          className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-[#319694] to-[#4fd1c5]"
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          transition={{ 
            duration: 2, 
            delay: 0.5 + index * 0.2,
            ease: "easeOut"
          }}
          viewport={{ once: false }}
        />
        
        <div>
          <h4 className="text-2xl font-bold text-[#319694] mb-4 flex items-center gap-3">
            {step.title}
            <motion.span
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              animate={{ x: [0, 8, 0] }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <ArrowRight size={20} className="text-[#4fd1c5]" />
            </motion.span>
          </h4>
          
          <div className="space-y-4 text-gray-700">
            {step.content.map((p, i) => (
              <motion.p 
                key={i}
                className="text-lg"
                initial={{ x: 10, opacity: 0.8 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.15 + i * 0.05 }}
                viewport={{ once: false }}
              >
                {p}
              </motion.p>
            ))}
            
            {step.list && (
              <ul className="list-disc pl-6 space-y-3">
                {step.list.map((item, i) => (
                  <motion.li 
                    key={i}
                    className="flex items-start gap-3 text-lg"
                    initial={{ opacity: 0.8, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.15 + i * 0.07 }}
                    viewport={{ once: false }}
                  >
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3
                      }}
                    >
                      <Circle className="w-3 h-3 mt-2 text-[#319694] fill-current" />
                    </motion.span>
                    <span>{item}</span>
                  </motion.li>
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