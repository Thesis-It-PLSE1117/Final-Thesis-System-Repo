import { motion } from "framer-motion";
import { useState } from "react";
import { HelpCircle, BookOpen } from "lucide-react";
import DataCenterHelp from "./DataCenterHelp";
import WorkloadHelp from "./WorkloadHelp";
import ProjectOverview from "./ProjectOverview";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

const tabContentVariants = {
  enter: { opacity: 0, x: 50 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 }
};

const HelpTab = () => {
  const [activeTab, setActiveTab] = useState('datacenter');

  return (
    <motion.div
      className="max-w-5xl mx-auto p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg space-y-10 border border-[#319694]/10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header Section */}
      <motion.header 
        className="flex items-center gap-4"
        variants={itemVariants}
      >
        <div className="p-3 bg-[#319694]/10 rounded-full">
          <HelpCircle className="text-3xl text-[#319694]" />
        </div>
        <motion.h2
          className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#267b79] to-[#4fd1c5]"
          variants={itemVariants}
        >
          Simulation Configuration Guide
        </motion.h2>
      </motion.header>

      {/* Tab Navigation */}
      <motion.nav 
        className="flex border-b border-[#319694]/10"
        variants={itemVariants}
      >
        <button
          className={`px-4 py-2 font-medium text-sm flex items-center gap-2 transition-all duration-200 ${
            activeTab === 'datacenter' 
              ? 'text-[#319694] border-b-2 border-[#319694]' 
              : 'text-gray-500 hover:text-[#319694]'
          }`}
          onClick={() => setActiveTab('datacenter')}
        >
          Data Center
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm flex items-center gap-2 transition-all duration-200 ${
            activeTab === 'workload' 
              ? 'text-[#319694] border-b-2 border-[#319694]' 
              : 'text-gray-500 hover:text-[#319694]'
          }`}
          onClick={() => setActiveTab('workload')}
        >
          Workload Configuration
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm flex items-center gap-2 transition-all duration-200 ${
            activeTab === 'documentation' 
              ? 'text-[#319694] border-b-2 border-[#319694]' 
              : 'text-gray-500 hover:text-[#319694]'
          }`}
          onClick={() => setActiveTab('documentation')}
        >
          <BookOpen size={16} />
          Project Overview
        </button>
      </motion.nav>

      {/* Tab Content with Smooth Transitions */}
      <motion.div 
        key={activeTab}
        initial="enter"
        animate="center"
        exit="exit"
        variants={tabContentVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="min-h-[400px]"
      >
        {activeTab === 'datacenter' && <DataCenterHelp />}
        {activeTab === 'workload' && <WorkloadHelp />}
        {activeTab === 'documentation' && <ProjectOverview />}
      </motion.div>
    </motion.div>
  );
};

export default HelpTab;