import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronRight, Home, FileText, Cpu, Code, BarChart2, HelpCircle, Link as LinkIcon, Zap } from "lucide-react";
import { useState } from "react";

const DocumentationHelp = () => {
  const [activeSections, setActiveSections] = useState({});

  const toggleSection = (index) => {
    setActiveSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const sections = [
    {
      title: "Introduction",
      icon: <FileText className="w-5 h-5" />,
      content: "Overview of the cloud load balancing simulation project and its objectives."
    },
    {
      title: "Dataset",
      icon: <BookOpen className="w-5 h-5" />,
      content: "Details about the dataset used for simulations and workload generation."
    },
    {
      title: "Preprocessing Steps",
      icon: <Cpu className="w-5 h-5" />,
      content: "How we prepare and normalize the data before running simulations."
    },
    {
      title: "Algorithms",
      icon: <Code className="w-5 h-5" />,
      subsections: [
        {
          title: "Round Robin (RR)",
          content: "Traditional load balancing algorithm that distributes requests equally."
        },
        {
          title: "Enhanced PSO (EPSO)",
          content: "Our improved Particle Swarm Optimization algorithm for load balancing."
        }
      ]
    },
    {
      title: "System Architecture",
      icon: <BarChart2 className="w-5 h-5" />,
      content: "Technical overview of the simulation system's components and design."
    },
    {
      title: "Frontend Guide",
      icon: <HelpCircle className="w-5 h-5" />,
      subsections: [
        { title: "Overview", content: "General frontend structure and capabilities" },
        { title: "UI Walkthrough", content: "How to navigate the interface" },
        { title: "Features", content: "Key features and their functions" },
        { title: "Interaction Diagrams", content: "Visual representations of user flows" }
      ]
    },
    {
      title: "Results & Analysis",
      icon: <LinkIcon className="w-5 h-5" />,
      content: "Findings from our simulations and comparative analysis of algorithms."
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-6 space-y-8"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-4 mb-8"
      >
        <div className="p-3 bg-[#319694]/10 rounded-full">
          <Zap className="text-[#319694] animate-pulse" />
        </div>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#267b79] to-[#4fd1c5]">
          Project Documentation
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, index) => (
          <div key={index} className="relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#319694]/10 shadow-sm overflow-hidden"
            >
              <motion.button
                whileHover={{ backgroundColor: "#f0fdf4" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleSection(index)}
                className={`w-full p-5 text-left flex items-center justify-between transition-colors ${
                  activeSections[index] ? 'bg-[#319694]/10' : 'bg-white/90'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-[#319694]">{section.icon}</div>
                  <h3 className="font-semibold text-gray-800">{section.title}</h3>
                </div>
                <motion.div
                  animate={{ rotate: activeSections[index] ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="text-[#319694]" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {activeSections[index] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 pt-0">
                      {section.content && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="text-gray-600 mb-4"
                        >
                          {section.content}
                        </motion.p>
                      )}

                      {section.subsections && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="space-y-3"
                        >
                          {section.subsections.map((sub, subIndex) => (
                            <motion.div
                              key={subIndex}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 + subIndex * 0.1 }}
                              className="pl-4 border-l-2 border-[#319694]/30"
                            >
                              <h4 className="font-medium text-[#319694]">{sub.title}</h4>
                              <p className="text-sm text-gray-500 mt-1">{sub.content}</p>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 bg-[#319694]/10 rounded-xl p-6 border border-[#319694]/20"
      >
        <h3 className="font-semibold text-[#319694] mb-3 flex items-center gap-2">
          <Home className="w-5 h-5" /> Getting Started
        </h3>
        <p className="text-gray-600 mb-4">
          New to the project? Begin with our installation guide and tutorial walkthroughs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Installation', 'Simulation Guide', 'Custom Workloads'].map((item, idx) => (
            <motion.button
              key={idx}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-lg p-4 shadow-xs border border-[#319694]/10 text-left"
            >
              <h4 className="font-medium text-[#319694]">{item}</h4>
              <p className="text-sm text-gray-500 mt-1">
                {idx === 0 && "How to set up the simulation environment"}
                {idx === 1 && "Running your first load balancing simulation"}
                {idx === 2 && "Using custom datasets and workload patterns"}
              </p>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DocumentationHelp;