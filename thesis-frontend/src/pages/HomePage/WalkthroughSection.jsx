import { motion } from 'framer-motion';
import WalkthroughStep from './WalkthroughStep';
import { Zap, Server, Cpu, BarChart2, ChevronDown, Sparkles, Code, Cloud, Database, Network } from 'lucide-react';

const WalkthroughSection = ({ walkthroughSteps }) => {
  return (
    <motion.section 
      id="walkthrough"
      className="px-6 py-30 bg-white/90 backdrop-blur-sm relative overflow-hidden"
      initial={{ opacity: 1 }}
      whileInView={{ opacity: 1 }}
      onViewportLeave={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: false, margin: "-100px" }}
    >
      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 left-10 text-[#319694]/10 z-0"
        animate={{
          y: [0, -30, 0],
          rotate: [0, 15, 0],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Cloud size={140} />
      </motion.div>
      
      <motion.div
        className="absolute bottom-32 right-16 text-[#4fd1c5]/10 z-0"
        animate={{
          y: [0, 30, 0],
          rotate: [0, -15, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      >
        <Network size={160} />
      </motion.div>

      <motion.div
        className="absolute top-1/3 right-20 text-[#267b79]/10 z-0"
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
          rotate: [0, 360, 0]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      >
        <Database size={100} />
      </motion.div>

      <motion.div
        className="absolute bottom-1/4 left-24 text-[#4fd1c5]/10 z-0"
        animate={{
          y: [0, 15, 0],
          x: [0, -10, 0],
          rotate: [0, -360, 0]
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
      >
        <Code size={90} />
      </motion.div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ y: 20 }}
          whileInView={{ y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: false }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-[#e0f7f6] text-[#1a5654] px-4 py-2 rounded-full mb-4 text-sm font-medium shadow-inner"
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            viewport={{ once: false }}
          >
            <Zap className="w-4 h-4 animate-pulse" />
            <span>Step-by-Step Guide</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.span>
          </motion.div>
          
          <motion.h3
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            initial={{ y: 10 }}
            whileInView={{ y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: false }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#267b79] to-[#4fd1c5]">
              Simulation Walkthrough
            </span>
          </motion.h3>
          
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0.5 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: false }}
          >
            Learn how to explore and compare different load balancing algorithms
          </motion.p>
        </motion.div>

        <div className="relative">
          <motion.div
            className="absolute left-8 top-0 h-full w-1 bg-gradient-to-b from-[#319694] to-[#4fd1c5]"
            initial={{ scaleY: 0, originY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            viewport={{ once: false }}
          >
            <motion.div
              className="absolute top-0 left-0 w-full h-8 bg-white blur-md"
              animate={{ y: [0, '100%'] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </motion.div>
          
          <div className="space-y-12 pl-12">
            {walkthroughSteps.map((step, idx) => (
              <WalkthroughStep key={idx} step={step} index={idx} />
            ))}
          </div>
        </div>

        <motion.div
          className="mt-20 p-8 bg-gradient-to-r from-[#e0f7f6] to-[#c4f1ef] rounded-xl shadow-lg border border-[#319694]/20 relative overflow-hidden group"
          initial={{ y: 30 }}
          whileInView={{ y: 0 }}
          transition={{ delay: 0.8, type: 'spring' }}
          viewport={{ once: false }}
          whileHover={{ y: -5, scale: 1.02 }}
        >
          <motion.div
            className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%']
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
          
          <motion.div
            className="absolute -right-6 -top-6 text-[#319694]/10"
            animate={{
              rotate: [0, 360]
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <BarChart2 size={120} />
          </motion.div>
          
          <div className="relative z-10">
            <motion.div
              className="flex items-start gap-6"
              initial={{ opacity: 0.8 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1 }}
              viewport={{ once: false }}
            >
              <div className="bg-white p-4 rounded-xl shadow-sm mt-1 flex-shrink-0">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }}
                >
                  <BarChart2 className="text-[#319694]" size={28} />
                </motion.div>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-gray-800 mb-4">Understanding the Results</h4>
                <p className="text-gray-700 text-lg">
                  By following these steps, you can explore how different load balancing algorithms distribute workloads across multiple servers. 
                  This simulation helps in evaluating system performance and optimizing resource allocation for efficient cloud management.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0.8 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          viewport={{ once: false }}
        >
          <motion.button
            onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
            className="text-[#319694] flex flex-col items-center gap-2 mx-auto group"
            whileHover={{ y: 5 }}
          >
            <span className="text-sm font-medium">Continue Exploring</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="group-hover:animate-none"
            >
              <ChevronDown size={24} className="group-hover:text-[#267b79] transition-colors" />
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default WalkthroughSection;