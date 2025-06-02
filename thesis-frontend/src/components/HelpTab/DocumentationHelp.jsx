import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronRight, FileText, Cpu, Code, BarChart2, HelpCircle, Link as LinkIcon, Zap, Server, Clock, Gauge, Activity, Battery, Layers } from "lucide-react";
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
      content: "This documentation covers our cloud load balancing simulation system comparing Enhanced ACO (Ant Colony Optimization) and Enhanced PSO (Particle Swarm Optimization) algorithms for efficient task scheduling in cloud environments."
    },
    {
      title: "Dataset & Workloads",
      icon: <BookOpen className="w-5 h-5" />,
      content: "The system uses customizable cloudlet workloads in CSV format, containing task specifications including length, file size, output size, and arrival time. Sample datasets are provided for quick testing."
    },
    {
      title: "System Requirements",
      icon: <Server className="w-5 h-5" />,
      content: "Minimum requirements include modern browsers (Chrome/Firefox/Edge) with JavaScript enabled. For optimal performance, we recommend systems with 8GB+ RAM when running complex simulations."
    },
    {
      title: "Algorithms",
      icon: <Code className="w-5 h-5" />,
      subsections: [
        {
          title: "Enhanced ACO (EACO)",
          content: "Our modified Ant Colony Optimization algorithm featuring adaptive pheromone evaporation rates and heuristic-based load information for dynamic cloud environments."
        },
        {
          title: "Enhanced PSO (EPSO)",
          content: "Improved Particle Swarm Optimization with nonlinear inertia weight reduction and adaptive velocity clamping for faster convergence in load balancing scenarios."
        }
      ]
    },
    {
      title: "Performance Metrics",
      icon: <BarChart2 className="w-5 h-5" />,
      subsections: [
        {
          title: "Response Time",
          content: "Time taken from task submission to completion (measured in milliseconds)"
        },
        {
          title: "Resource Utilization",
          content: "Percentage of available CPU, memory, and bandwidth being used effectively (higher is better)"
        },
        {
          title: "Energy Efficiency",
          content: "Power consumption relative to computational output (watts per task, lower is better)"
        },
        {
          title: "Load Imbalance",
          content: "Measure of uneven distribution across VMs (0-1 scale, lower values indicate better balance)"
        },
        {
          title: "Makespan",
          content: "Total time to complete all tasks in the workload (measured in milliseconds)"
        }
      ]
    },
    {
      title: "Simulation Guide",
      icon: <HelpCircle className="w-5 h-5" />,
      subsections: [
        { 
          title: "Configuration", 
          content: "Set up data center specifications including hosts, VMs, and their capabilities" 
        },
        { 
          title: "Workload Upload", 
          content: "Import custom datasets or use provided samples" 
        },
        { 
          title: "Algorithm Selection", 
          content: "Choose between EACO, EPSO or compare both" 
        },
        { 
          title: "Result Analysis", 
          content: "Interpret the performance metrics and visualizations" 
        }
      ]
    },
    {
      title: "Technical Details",
      icon: <Cpu className="w-5 h-5" />,
      content: "The system architecture includes a React.js frontend with visualization components and a simulation engine implementing the load balancing algorithms. All computations run client-side for privacy."
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
          Simulation Documentation
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
          <Clock className="w-5 h-5" /> Key Performance Indicators
        </h3>
        <p className="text-gray-600 mb-4">
          These metrics are used to evaluate and compare algorithm performance:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { 
              title: "Response Time", 
              icon: <Clock className="text-[#319694]" />,
              desc: "Task completion latency (ms)" 
            },
            { 
              title: "Resource Utilization", 
              icon: <Activity className="text-[#319694]" />,
              desc: "Effective resource usage (%)" 
            },
            { 
              title: "Energy Efficiency", 
              icon: <Battery className="text-[#319694]" />,
              desc: "Power per computation (W)" 
            },
            { 
              title: "Load Imbalance", 
              icon: <Gauge className="text-[#319694]" />,
              desc: "VM workload distribution (0-1)" 
            },
            { 
              title: "Makespan", 
              icon: <Layers className="text-[#319694]" />,
              desc: "Total workload time (ms)" 
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -2 }}
              className="bg-white rounded-lg p-4 shadow-xs border border-[#319694]/10"
            >
              <div className="flex items-center gap-3 mb-2">
                {item.icon}
                <h4 className="font-medium text-[#319694]">{item.title}</h4>
              </div>
              <p className="text-sm text-gray-500">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DocumentationHelp;