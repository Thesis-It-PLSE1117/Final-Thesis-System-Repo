import { motion } from "framer-motion";
import { useState } from "react";
import { HelpCircle, BookOpen, BarChart3, Navigation, Activity, Code, Building, DatabaseIcon } from "lucide-react";
import DataCenterHelp from "./DataCenterHelp";
import WorkloadHelp from "./WorkloadHelp";
import ProjectOverview from "./ProjectOverview";
import StatisticalMethodology from "./StatisticalMethodology";
import SystemNavigationHelp from "./SystemNavigationHelp";
import AnimationResultsHelp from "./AnimationResultsHelp";
import CoreAlgo from "./CoreAlgo";

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

const HelpTab = ({ onNavigateBackToResults, showBackButton = false, initialTab = 'navigation' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <motion.div
      className="max-w-5xl mx-auto p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg space-y-10 border border-[#319694]/10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header Section */}
      <motion.header
        className="flex items-center justify-between"
        variants={itemVariants}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#319694]/10 rounded-full">
            <HelpCircle className="text-3xl text-[#319694]" />
          </div>
          <motion.h2
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#267b79] to-[#4fd1c5]"
            variants={itemVariants}
          >
            Simulation Configuration Guide
          </motion.h2>
        </div>

        {/* Back Button - Only show when accessed from ResultsTab */}
        {showBackButton && onNavigateBackToResults && (
          <motion.button
            onClick={onNavigateBackToResults}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2 font-medium shadow-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            variants={itemVariants}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Results
          </motion.button>
        )}
      </motion.header>

      {/* Tab Navigation */}
      <motion.nav 
        className="flex flex-wrap border-b border-[#319694]/10"
        variants={itemVariants}
      >
        <button
          className={`px-3 py-2 font-medium text-sm flex items-center gap-2 transition-all duration-200 ${
            activeTab === 'navigation' 
              ? 'text-[#319694] border-b-2 border-[#319694]' 
              : 'text-gray-500 hover:text-[#319694]'
          }`}
          onClick={() => setActiveTab('navigation')}
        >
          <Navigation size={16} />
          Navigation
        </button>
        <button
          className={`px-3 py-2 font-medium text-sm flex items-center gap-2 transition-all duration-200 ${
            activeTab === 'animation' 
              ? 'text-[#319694] border-b-2 border-[#319694]' 
              : 'text-gray-500 hover:text-[#319694]'
          }`}
          onClick={() => setActiveTab('animation')}
        >
          <Activity size={16} />
          Results
        </button>
        <button
          className={`px-3 py-2 font-medium text-sm flex items-center gap-2 transition-all duration-200 ${
            activeTab === 'datacenter' 
              ? 'text-[#319694] border-b-2 border-[#319694]' 
              : 'text-gray-500 hover:text-[#319694]'
          }`}
          onClick={() => setActiveTab('datacenter')}
        >
          <Building size={16} />
          Data Center
        </button>
        <button
          className={`px-3 py-2 font-medium text-sm flex items-center gap-2 transition-all duration-200 ${
            activeTab === 'workload'
              ? 'text-[#319694] border-b-2 border-[#319694]'
              : 'text-gray-500 hover:text-[#319694]'
          }`}
          onClick={() => setActiveTab('workload')}
        >
          <DatabaseIcon size={16} />
          Workload
        </button>
        <button
          className={`px-3 py-2 font-medium text-sm flex items-center gap-2 transition-all duration-200 ${
            activeTab === 'algorithms'
              ? 'text-[#319694] border-b-2 border-[#319694]'
              : 'text-gray-500 hover:text-[#319694]'
          }`}
          onClick={() => setActiveTab('algorithms')}
        >
          <Code size={16} />
          Core Algorithms
        </button>
        <button
          className={`px-3 py-2 font-medium text-sm flex items-center gap-2 transition-all duration-200 ${
            activeTab === 'documentation'
              ? 'text-[#319694] border-b-2 border-[#319694]'
              : 'text-gray-500 hover:text-[#319694]'
          }`}
          onClick={() => setActiveTab('documentation')}
        >
          <BookOpen size={16} />
          Overview
        </button>
        <button
          className={`px-3 py-2 font-medium text-sm flex items-center gap-2 transition-all duration-200 ${
            activeTab === 'methodology' 
              ? 'text-[#319694] border-b-2 border-[#319694]' 
              : 'text-gray-500 hover:text-[#319694]'
          }`}
          onClick={() => setActiveTab('methodology')}
        >
          <BarChart3 size={16} />
          Statistics
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
        {activeTab === 'navigation' && <SystemNavigationHelp />}
        {activeTab === 'datacenter' && <DataCenterHelp />}
        {activeTab === 'workload' && <WorkloadHelp />}
        {activeTab === 'animation' && <AnimationResultsHelp />}
        {activeTab === 'algorithms' && <CoreAlgo />}
        {activeTab === 'documentation' && <ProjectOverview />}
        {activeTab === 'methodology' && <StatisticalMethodology />}
      </motion.div>
    </motion.div>
  );
};

export default HelpTab;
