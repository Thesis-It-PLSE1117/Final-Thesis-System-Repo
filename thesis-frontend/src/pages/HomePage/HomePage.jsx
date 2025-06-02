import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Settings, Upload, Cpu, LineChart, BookText, GitCompare, FileText, Mail } from 'lucide-react'; 
import AboutUsModal from '../../components/modals/AboutUsModal';
import DocumentationModal from '../../components/modals/DocumentationModal';
import AlgorithmModal from '../../components/modals/AlgorithmModal';
import ComparisonModal from '../../components/modals/ComparisonModal';
import SimulationPage from '../SimulationPage';
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
    return <SimulationPage onBack={() => setShowSimulation(false)} />;
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
      title: "1. Configure Your Data Center",
      content: [
        "Specify host and VM configurations including processing capabilities, memory, bandwidth, and storage.",
        "Choose the load balancing algorithm to evaluate (Enhanced ACO, Enhanced PSO, or compare both)."
      ],
      list: [
        "Number of Hosts",
        "MIPS, RAM, BW, Storage specs",
        "Number of VMs & VM Specifications",
        "Select algorithm type"
      ]
    },
    {
      icon: <Upload className="w-8 h-8" />,
      title: "2. Upload Workload Data",
      content: [
        "Upload a CSV file representing your cloudlet workload or use a predefined dataset.",
        "The simulation uses this file to dispatch tasks during runtime."
      ],
      list: [
        "Ensure CSV format is correct",
        "Check that the row count matches your configuration",
        "Use preset files for quicker setup"
      ]
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "3. Run the Simulation",
      content: [
        "After configuration and upload, start the simulation.",
        "Tasks will be distributed to VMs based on the selected algorithm.",
        "Animations will help visualize task allocation across the virtual infrastructure."
      ],
      list: [
        "Click 'Run Simulation'",
        "Observe real-time animations of task scheduling",
        "Compare fairness and optimization"
      ]
    },
    {
      icon: <LineChart className="w-8 h-8" />,
      title: "4. Analyze Simulation Results",
      content: [
        "Once the simulation finishes, detailed metrics will be displayed.",
        "Results provide insight into system efficiency, including:"
      ],
      list: [
        "Total tasks and completion rate",
        "Makespan and average wait time",
        "Resource utilization percentage",
        "Per-task execution details",
        "Algorithm-specific performance metrics"
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
        { text: "Enhanced ACO", href: "#", icon: <Cpu size={16} />, onClick: () => openModal('aco') },
        { text: "Enhanced PSO", href: "#", icon: <Cpu size={16} />, onClick: () => openModal('pso') },
        { text: "Comparison", href: "#", icon: <GitCompare size={16} />, onClick: () => openModal('comparison') }
      ]
    },
    {
      title: "Contact",
      links: [
        { text: "csa7-2025@gmail.com", href: "gmail.com", icon: <Mail size={16} /> },
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

      <AboutUsModal 
        isOpen={isAboutModalOpen} 
        onClose={() => setIsAboutModalOpen(false)} 
      />
      
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
              content: "The system consists of a frontend built with React.js and a backend simulation engine. The visualization components help understand how tasks are distributed across VMs in real-time.",
              icon: <Settings className="text-[#4fd1c5]" />
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
      
      <AlgorithmModal 
        isOpen={activeModal === 'aco'} 
        onClose={closeModal}
        algorithm={{
          name: "Enhanced Ant Colony Optimization",
          enhancements: [
            "Adaptive pheromone evaporation based on system load",
            "Heuristic-guided initial pheromone distribution",
            "Dynamic exploration-exploitation balance",
            "Workload-aware parameter adjustment"
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
          name: "Enhanced Particle Swarm Optimization",
          enhancements: [
            "Nonlinear inertia weight reduction",
            "Adaptive velocity clamping",
            "Dynamic neighborhood topology",
            "Hybrid local-global search strategy"
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
    </motion.div>
  );
};

export default HomePage;