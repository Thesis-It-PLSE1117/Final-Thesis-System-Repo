import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Settings, Upload, Cpu, LineChart, BookOpen, Users } from 'lucide-react'; 
import { FaGithub } from 'react-icons/fa';
import { lazy, Suspense } from 'react';
const AboutUsModal = lazy(() => import('../../components/modals/AboutUsModal'));
const SimulationPage = lazy(() => import('../SimulationPage'));
import AnimatedBackground from './AnimatedBackground';
import Header from './Header';
import HeroSection from './HeroSection';
import DemoSection from './DemoSection';
import WalkthroughSection from './WalkthroughSection';
import CtaSection from './CtaSection';
import Footer from './Footer';
import ScrollToTop from '../../components/ScrollToTop';

const HomePage = () => {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [showSimulation, setShowSimulation] = useState(false);
    const [simulationInitialTab, setSimulationInitialTab] = useState("dataCenter");
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
          <div className="animate-spin motion-reduce:animate-none rounded-full h-16 w-16 border-t-2 border-b-2 border-[#319694]"></div>
        </div>
      }>
        <SimulationPage 
          onBack={() => {
            setShowSimulation(false);
            setSimulationInitialTab("dataCenter");
          }} 
          initialTab={simulationInitialTab}
        />
      </Suspense>
    );
  }


  const walkthroughSteps = [
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Configure Datacenter",
      content: [
        "Set up your datacenter infrastructure with hosts and virtual machines.",
        "Configure processing capabilities, memory, storage, and bandwidth specifications."
      ],
      list: [
        "Number of hosts and their MIPS capacity",
        "Virtual machine configurations (MIPS, RAM, Bandwidth)",
        "Host specifications (PEs, RAM, Storage)",
        "Apply preset configurations or customize settings"
      ]
    },
    {
      icon: <Upload className="w-8 h-8" />,
      title: "Load Workload Dataset",
      content: [
        "Upload CSV files with task specifications or select from Google Cluster presets.",
        "Configure task parameters and enable MATLAB visualization if needed."
      ],
      list: [
        "Upload custom CSV files with cloudlet specifications.",
        "Select from 30 Google Cluster subset presets.",
        "Configure cloudlet count.",
        "Enable MATLAB plots for visualization (optional, used more by the researchers).",
        "Default plots will be rendered if Matlab not toggled."
      ]
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "Set Iterations & Run",
      content: [
        "Configure simulation iterations for statistical analysis.",
        "Run EACO vs EPSO comparison with real-time animation (available in single iterations)."
      ],
      list: [
        "Set iteration count (30+ recommended for t-tests).",
        "Simulation will run both EACO and EPSO algorithms.",
        "Watch task scheduling animation (works in single iteration).",
        "Monitor progress across multiple iterations."
      ]
    },
    {
      icon: <LineChart className="w-8 h-8" />,
      title: "Analyze Results & History",
      content: [
        "View detailed performance analysis with statistical comparisons.",
        "Access saved simulation history and export results."
      ],
      list: [
        "Metadata, analysis, visualizations, and execution logs",
        "Paired t-test statistical significance results",
        "MATLAB-generated performance plots and charts",
        "Browse simulation history and export capabilities"
      ]
    }
  ];

  const footerLinks = [
    { 
      text: "GitHub", 
      href: "https://github.com/Thesis-It-PLSE1117/Final-Thesis-System-Repo.git", 
      icon: <FaGithub size={20} /> 
    },
    { 
      text: "Documentation", 
      href: "#", 
      icon: <BookOpen size={18} />,
      onClick: () => {
        setSimulationInitialTab("help");
        setShowSimulation(true);
      }
    },
    { 
      text: "Team", 
      href: "#", 
      icon: <Users size={18} />,
      onClick: () => setIsAboutModalOpen(true)
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
      />

      <Suspense fallback={null}>
        <AboutUsModal 
          isOpen={isAboutModalOpen} 
          onClose={() => setIsAboutModalOpen(false)} 
        />
      </Suspense>

      <ScrollToTop />
    </motion.div>
  );
};

export default HomePage;
