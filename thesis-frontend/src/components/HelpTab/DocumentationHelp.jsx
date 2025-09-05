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
      title: "Performance Metrics (Five Key Metrics)",
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
      title: "Enhanced Algorithms",
      icon: <Code className="w-5 h-5" />,
      subsections: [
        {
          title: "Enhanced Ant Colony Optimization (EACO)",
          content: "Adaptive ACO with two key enhancements: (1) Adaptive pheromone evaporation: p(t) = p_min + (p_max - p_min) × ((f_avg - f_best) / f_best), (2) Heuristic load-based reinforcement: Δτ_ij = 1 / (1 + L_j). Pheromone update: τ_ij(t+1) = (1 - p(t)) × τ_ij(t) + Δτ_ij(t). Balances exploration vs exploitation based on convergence and current system load."
        },
        {
          title: "Enhanced PSO (EPSO)",
          content: "PSO with nonlinear inertia weight reduction: w = w_max - (w_max - w_min) × (iteration/maxIterations)², and adaptive velocity clamping: V_max decreases quadratically over iterations. No VM migration required. Uses standard PSO velocity/position updates with cognitive (c1) and social (c2) coefficients."
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
      title: "Research Methodology",
      icon: <HelpCircle className="w-5 h-5" />,
      content: "Quantitative, simulation-based research design with expert evaluation. 30 participants: 15 IT experts and 15 end users (11 cloud specialists + 4 academic professionals). Purposive sampling method ensures relevant expertise.",
      subsections: [
        {
          title: "Statistical Analysis",
          content: "Paired t-test for algorithm comparison: t = X̄_d / (S_d/√n) where X̄_d is mean difference, S_d is standard deviation of differences, n is sample size. Significance level α = 0.05, two-tailed test."
        },
        {
          title: "Survey Evaluation",
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