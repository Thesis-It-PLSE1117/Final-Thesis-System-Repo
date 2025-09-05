import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Settings, Upload, Cpu, LineChart, BookText, GitCompare, FileText, Mail } from 'lucide-react'; 
import { lazy, Suspense } from 'react';
const AboutUsModal = lazy(() => import('../../components/modals/AboutUsModal'));
const DocumentationModal = lazy(() => import('../../components/modals/DocumentationModal'));
const AlgorithmModal = lazy(() => import('../../components/modals/AlgorithmModal'));
const ComparisonModal = lazy(() => import('../../components/modals/ComparisonModal'));
const SimulationPage = lazy(() => import('../SimulationPage'));
import AnimatedBackground from './AnimatedBackground';
import Header from './Header';
import HeroSection from './HeroSection';
import DemoSection from './DemoSection';
import WalkthroughSection from './WalkthroughSection';
import CtaSection from './CtaSection';
import Footer from './Footer';

const HomePage = () => {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [showSimulation, setShowSimulation] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        controls.start({
          x: [0, -500, 0],
          transition: { duration: 8, ease: "linear" }
        });
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, controls]);

  if (showSimulation) {
    return (
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#319694]"></div>
        </div>
      }>
        <SimulationPage onBack={() => setShowSimulation(false)} />
      </Suspense>
    );
  }

  const openModal = (modalName) => {
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const walkthroughSteps = [
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Configure Data Center",
      content: [
        "Define your data center infrastructure specifications including hosts, VMs, and their capabilities.",
        "Set up the initial configuration for your simulation environment."
      ],
      list: [
        "Number of physical hosts and their specifications",
        "Virtual machine configurations (CPU, RAM, Storage)",
        "Network bandwidth allocation",
        "Power consumption parameters"
      ]
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "Set Iteration Parameters",
      content: [
        "Configure the simulation runtime parameters to control the experiment duration and granularity.",
        "Specify the number of iterations for consistent performance evaluation."
      ],
      list: [
        "Number of simulation iterations",
        "Workload intensity levels",
      ]
    },
    {
      icon: <Upload className="w-8 h-8" />,
      title: "Define Workload",
      content: [
        "Upload your workload with its traffic model or select from predefined templates.",
        "Configure task characteristics and arrival patterns."
      ],
      list: [
        "Upload CSV with task specifications",
        "Set task arrival distribution",
        "Define computational requirements",
        "Configure priority levels if needed"
      ]
    },
    {
      icon: <LineChart className="w-8 h-8" />,
      title: "View Results",
      content: [
        "Analyze comprehensive performance metrics across all iterations.",
        "Compare results and identify optimization opportunities."
      ],
      list: [
        "Resource utilization across hosts",
        "Average task response time",
        "Energy efficiency metrics",
        "Makespan (total completion time)",
        "Degree of imbalance in load distribution"
      ]
    }
  ];

  const footerLinks = [
    {
      title: "Resources",
      links: [
        { text: "Documentation", href: "#", icon: <BookText size={16} />, onClick: () => openModal('documentation') },
        { text: "Research Paper", href: "https://docs.google.com/document/d/1NYjfhNk7LM67LDS1SdULkZ0WgZGMHuDq/edit?fbclid=IwZXh0bgNhZW0CMTEAAR7ulWdWXKfO8zESkvZ8M0iVmr80DYh5V9x8uNWXZBtTUkpMYF-Xbou2F0jx0w_aem_A7Q6gt6Js_R74zj6Yo7J_A", icon: <FileText size={16} /> },
        { text: "GitHub Repository", href: "https://github.com/Thesis-It-PLSE1117/Final-Thesis-System-Repo.git", icon: <GitCompare size={16} /> }
      ]
    },
    {
      title: "Algorithms",
      links: [
        { text: "EACO Algorithm", href: "#", icon: <Cpu size={16} />, onClick: () => openModal('aco') },
        { text: "EPSO Algorithm", href: "#", icon: <Cpu size={16} />, onClick: () => openModal('pso') },
        { text: "Comparison", href: "#", icon: <GitCompare size={16} />, onClick: () => openModal('comparison') }
      ]
    },
    {
      title: "Contact",
      links: [
        { text: "csa7-2025@gmail.com", href: "mailto:csa7-2025@gmail.com", icon: <Mail size={16} /> },
      ]
    }
  ];

  return (
    <motion.div
      className="flex flex-col min-h-screen font-sans bg-gradient-to-b from-white to-[#e0f7fa]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <AnimatedBackground />
      
      <Header onStartSimulation={() => setShowSimulation(true)} />
      
      <HeroSection onStartSimulation={() => setShowSimulation(true)} />
      
      <DemoSection 
        isPlaying={isPlaying} 
        setIsPlaying={setIsPlaying} 
        controls={controls} 
      />
      
      <WalkthroughSection walkthroughSteps={walkthroughSteps} />
      
      <CtaSection onStartSimulation={() => setShowSimulation(true)} />
      
      <Footer 
        footerLinks={footerLinks} 
        onOpenAboutUs={() => setIsAboutModalOpen(true)} 
      />

      <Suspense fallback={null}>
        <AboutUsModal 
          isOpen={isAboutModalOpen} 
          onClose={() => setIsAboutModalOpen(false)} 
        />
      </Suspense>
      
      <Suspense fallback={null}>
        <DocumentationModal
        isOpen={activeModal === 'documentation'} 
        onClose={closeModal}
        content={{
          title: "System Documentation",
          sections: [
            {
              title: "Overview",
              content: "This cloud load balancing simulation system allows you to compare enhanced versions of Ant Colony Optimization (ACO) and Particle Swarm Optimization (PSO) algorithms for virtual machine task scheduling.",
              icon: <BookText className="text-[#319694]" />
            },
            {
              title: "System Architecture",
              content: "CloudSim-based simulation framework with Spring Boot backend and React.js frontend. CustomBroker class inherits from CloudSim's DatacenterBroker and implements ISchedulingAlgorithm interface. MATLAB integration provides advanced visualization and statistical analysis of results.",
              icon: <Settings className="text-[#4fd1c5]" />,
              list: [
                "CustomBroker governs task and VM assignment",
                "EnhancedACO and EnhancedPSO implement ISchedulingAlgorithm interface",
                "DataCenterConfigurator manages simulation setup",
                "MATLAB Engine integration for advanced analytics",
                "Spring Boot + CloudSim core backend",
                "React.js frontend with Chart.js visualization"
              ]
            },
            {
              title: "Key Features",
              content: "",
              list: [
                "Interactive configuration of data center parameters",
                "Real-time simulation visualization",
                "Detailed performance metrics comparison",
                "Support for custom workload datasets",
                "Historical results saving and comparison"
              ],
              icon: <Cpu className="text-[#267b79]" />
            },
            {
              title: "Getting Started",
              content: "To begin, configure your data center specifications, upload or select a workload, choose an algorithm, and run the simulation. Results will be displayed upon completion.",
              icon: <LineChart className="text-[#319694]" />
            }
          ]
        }}
      />
      </Suspense>
      
      <Suspense fallback={null}>
        <AlgorithmModal
        isOpen={activeModal === 'aco'} 
        onClose={closeModal}
        algorithm={{
          name: "Enhanced Ant Colony Optimization (EACO)",
          enhancements: [
            "Adaptive pheromone evaporation: p(t) = p_min + (p_max - p_min) × ((f_avg - f_best) / f_best)",
            "Heuristic load-based reinforcement: Δτ_ij = 1 / (1 + L_j)",
            "Pheromone update rule: τ_ij(t+1) = (1 - p(t)) × τ_ij(t) + Δτ_ij(t)",
            "Dynamic exploration-exploitation balance based on convergence"
          ],
          parameters: [
            "Dynamic pheromone coefficient (α)",
            "Heuristic coefficient (β)",
            "Evaporation rate range (ρ_min to ρ_max)",
            "Colony size (number of ants)",
            "Maximum iterations"
          ],
          researchFocus: [
            "Improving convergence in dynamic environments",
            "Reducing computational overhead",
            "Optimizing for heterogeneous workloads",
            "Balancing exploration vs exploitation"
          ]
        }}
      />
      
      <AlgorithmModal 
        isOpen={activeModal === 'pso'} 
        onClose={closeModal}
        algorithm={{
          name: "Enhanced Particle Swarm Optimization (EPSO)",
          enhancements: [
            "Nonlinear inertia weight: w = w_max - (w_max - w_min) × (iteration/maxIterations)²",
            "Adaptive velocity clamping: V_max decreases quadratically over iterations",
            "Standard PSO velocity/position updates with cognitive (c1) and social (c2) coefficients",
            "No VM migration required for energy efficiency"
          ],
          parameters: [
            "Initial inertia weight (w_initial)",
            "Final inertia weight (w_final)",
            "Cognitive coefficient (c1)",
            "Social coefficient (c2)",
            "Swarm size"
          ],
          researchFocus: [
            "Improving initial convergence speed",
            "Preventing premature convergence",
            "Adapting to varying workload sizes",
            "Optimizing for homogeneous environments"
          ]
        }}
      />
      
      <ComparisonModal 
        isOpen={activeModal === 'comparison'} 
        onClose={closeModal}
        comparison={{
          title: "Algorithm Comparison Framework",
          metrics: [
            {
              name: "Approach",
              aco: "Pheromone-based path optimization",
              pso: "Swarm intelligence with velocity vectors",
              description: "Fundamentally different bio-inspired approaches"
            },
            {
              name: "Enhancement Focus",
              aco: "Dynamic parameter adaptation",
              pso: "Convergence optimization",
              description: "Different optimization targets for cloud environments"
            },
            {
              name: "Expected Strengths",
              aco: "Better for dynamic, heterogeneous workloads",
              pso: "Faster initial convergence",
              description: "Theoretical advantages being tested"
            },
            {
              name: "Research Variables",
              aco: "Pheromone decay rates, heuristic weights",
              pso: "Inertia coefficients, velocity limits",
              description: "Key parameters under investigation"
            }
          ],
          recommendations: [
            "Run simulations with both algorithms for comprehensive comparison",
            "Test with realistic workloads from Google Cluster Traces)",
            "Compare performance across different data center sizes",
            "Evaluate energy efficiency alongside performance metrics",
          ]
        }}
      />
      </Suspense>
    </motion.div>
  );
};

export default HomePage;