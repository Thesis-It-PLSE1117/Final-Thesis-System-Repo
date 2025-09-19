import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronRight, Home, FileText, Cpu, Code, BarChart2, HelpCircle, Link as LinkIcon, Zap } from "lucide-react";
import { useState } from "react";

const ProjectOverview = () => {
  const [activeSections, setActiveSections] = useState({});

  const toggleSection = (index) => {
    setActiveSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const sections = [
    {
      title: "Project Introduction",
      icon: <FileText className="w-5 h-5" />,
      content: "This cloud load balancing simulation system compares Enhanced Particle Swarm Optimization (EPSO) and Enhanced Ant Colony Optimization (EACO) algorithms using CloudSim framework with realistic Google Cluster Dataset workloads."
    },
    {
      title: "Dataset & Provenance",
      icon: <BookOpen className="w-5 h-5" />,
      content: "We use preprocessed subsets of the Google Cluster Traces dataset. Timestamps (arrival_ts) are provided in microseconds and normalized to seconds using the formula: t := (arrival_ts - min(arrival_ts)) / 1e6. The file_size and output_size values are interpreted as normalized fractions (0–1) and scaled to bytes for simulation.",
      subsections: [
        { 
          title: "Two CSV Schemas Supported", 
          content: "(1) Normalized Schema: length (cloudlet work in MI), pes (processing elements per task), file_size (normalized 0–1, scaled to bytes), output_size (normalized 0–1, scaled to bytes). (2) Google Schema: arrival_ts (μs, converted to seconds), cpu_request (0–1), memory_request (0–1), file_size (0–1, scaled), output_size (0–1, scaled), pes_number (rounded to integer), time_window (optional, used with cpu_request to derive MI)." 
        }
      ]
    },
    {
      title: "Performance Metrics",
      icon: <BarChart2 className="w-5 h-5" />,
      subsections: [
        {
          title: "1. Response Time",
          content: "Duration between task submission and completion. Formula: (1/n) × Σ(completion_time - submission_time). Critical for measuring system responsiveness and user satisfaction."
        },
        {
          title: "2. Resource Utilization", 
          content: "Efficiency of CPU and memory usage across VMs. Formula: (1/m) × Σ(U_j^P) where U_j^P is CPU utilization of host j. Higher utilization indicates better resource usage."
        },
        {
          title: "3. Energy Efficiency",
          content: "Power consumption during task scheduling using Zhang & Li's energy model. Formula: Energy = Σ P_j where P_j considers busy power (215W) and idle power (162W) based on CPU utilization."
        },
        {
          title: "4. Degree of Imbalance (DI)",
          content: "Measures workload distribution evenness across VMs. Formula: DI = (MaxTime - MinTime) / AverageTime. Lower values indicate better load balancing."
        },
        {
          title: "5. Makespan",
          content: "Total time to complete all tasks in the system. Formula: Makespan = Max(Σ CompletionTime). Determined by the VM that finishes last, indicating overall scheduling efficiency."
        }
      ]
    },
    {
      title: "Core Algorithms",
      icon: <Code className="w-5 h-5" />,
      subsections: [
        {
          title: "Enhanced Ant Colony Optimization (EACO)",
          content: "Advanced ACO algorithm with smart adaptations for cloud scheduling. Features adaptive pheromone evaporation that adjusts based on solution quality, load-aware reinforcement that considers VM workloads, and early stopping when solutions converge. Each ant builds complete task-to-VM assignments probabilistically, with successful paths reinforced through pheromone deposits."
        },
        {
          title: "Enhanced Particle Swarm Optimization (EPSO)",
          content: "Improved PSO algorithm optimized for cloud task scheduling. Uses quadratic inertia weight decay for better exploration-to-exploitation transition, adaptive velocity limits that decrease over time, and early stopping detection. Particles represent complete scheduling solutions, evolving toward optimal task assignments through swarm intelligence."
        },
        {
          title: "Algorithm References",
          content: (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 mb-3">
                Learn more about the foundational algorithms that inspired our enhanced versions:
              </p>
              <div className="flex flex-col gap-2">
                <a 
                  href="https://www.techscience.com/cmc/v82n2/59521/html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#319694] hover:text-[#267b79] transition-colors"
                >
                  <LinkIcon className="w-4 h-4" />
                  Particle Swarm Optimization (PSO) - Technical Overview
                </a>
                <a 
                  href="https://en.wikipedia.org/wiki/Ant_colony_optimization_algorithms" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#319694] hover:text-[#267b79] transition-colors"
                >
                  <LinkIcon className="w-4 h-4" />
                  Ant Colony Optimization (ACO) - Algorithm Overview
                </a>
              </div>
            </div>
          )
        }
      ]
    },
    {
      title: "System Architecture",
      icon: <BarChart2 className="w-5 h-5" />,
      content: "CloudSim-based simulation framework with Spring Boot backend and React frontend. CustomBroker class inherits from CloudSim's DatacenterBroker and implements ISchedulingAlgorithm interface. MATLAB integration provides advanced visualization and statistical analysis of results.",
      subsections: [
        {
          title: "Core Components",
          content: "CustomBroker governs task and VM assignment, EnhancedACO and EnhancedPSO implement ISchedulingAlgorithm interface, DataCenterConfigurator manages simulation setup with hosts, VMs, and power models."
        },
        {
          title: "Technology Stack",
          content: "Backend: Spring Boot + CloudSim core + MATLAB Engine. Frontend: React.js + Chart.js for visualization. Data: Google Cluster Dataset preprocessing with Python + pandas/numpy."
        }
      ]
    },
    {
      title: "Research Approach",
      icon: <HelpCircle className="w-5 h-5" />,
      content: "Quantitative, simulation-based research design with expert evaluation. 30 participants: 15 IT experts and 15 end users (11 cloud specialists + 4 academic professionals). Purposive sampling method ensures relevant expertise.",
      subsections: [
        {
          title: "Statistical Analysis",
          content: "Paired t-test for algorithm comparison: t = X̄_d / (S_d/√n) where X̄_d is mean difference, S_d is standard deviation of differences, n is sample size. Significance level α = 0.05, two-tailed test."
        },
        {
          title: "Evaluation Methodology",
          content: "Likert scale with four response options: 4 (Strongly Agree, 3.26–4.00), 3 (Agree, 2.51–3.25), 2 (Disagree, 1.76–2.50), 1 (Strongly Disagree, 1.00–1.75). Median scores used for stability with small groups."
        }
      ]
    },
    {
      title: "Submission Modes",
      icon: <Cpu className="w-5 h-5" />,
      content: "Two submission modes supported: (1) Batch submission (default) - all tasks submitted at t=0 for controlled algorithm comparison, (2) Staged submission (optional) - tasks submitted according to normalized arrival times when arrival_ts is present and enabled."
    },
    {
      title: "Methodology Notes",
      icon: <BookOpen className="w-5 h-5" />,
      subsections: [
        { 
          title: "Survey Administration", 
          content: "End-user and IT-expert questionnaires administered via Google Forms using Likert scale. Participants evaluate functional suitability, interaction capability, performance efficiency, and scalability. Aggregated findings reported in manuscript; this app does not store survey responses." 
        },
        { 
          title: "Data Provenance & Ethics", 
          content: "Google Cluster subset with arrival_ts in μs, normalized to seconds. Voluntary participation with informed consent. Confidentiality maintained throughout evaluation process. Results validated through expert feedback from cloud specialists and IT professionals." 
        }
      ]
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
          Project Overview
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
    </motion.div>
  );
};

export default ProjectOverview;