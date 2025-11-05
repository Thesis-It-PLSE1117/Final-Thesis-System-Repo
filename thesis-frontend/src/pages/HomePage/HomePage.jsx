import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import {
  Settings,
  Upload,
  Cpu,
  LineChart,
  BookOpen,
  Users,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { lazy, Suspense } from "react";
const AboutUsModal = lazy(() => import("../../components/modals/AboutUsModal"));
const SimulationPage = lazy(() => import("../SimulationPage"));
import AnimatedBackground from "./AnimatedBackground";
import Header from "./Header";
import HeroSection from "./HeroSection";
import DemoSection from "./DemoSection";
import WalkthroughSection from "./WalkthroughSection";
import CtaSection from "./CtaSection";
import Footer from "./Footer";
import ScrollToTop from "../../components/ScrollToTop";

const HomePage = () => {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [showSimulation, setShowSimulation] = useState(false);
  const [simulationInitialTab, setSimulationInitialTab] =
    useState("dataCenter");
  const [isPlaying, setIsPlaying] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        controls.start({
          x: [0, -500, 0],
          transition: { duration: 8, ease: "linear" },
        });
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, controls]);

  if (showSimulation) {
    return (
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin motion-reduce:animate-none rounded-full h-16 w-16 border-t-2 border-b-2 border-[#319694]"></div>
          </div>
        }
      >
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
      title: "Set Up Your Cloud Environment",
      content: [
        "Create your cloud infrastructure with hosts and virtual machines.",
        "Set processing power, memory, storage, and network settings.",
      ],
      list: [
        "Number of hosts and their processing capacity",
        "Virtual machine settings (CPU, RAM, Bandwidth)",
        "Host details (Cores, RAM, Storage)",
        "Use preset configurations or create custom settings",
      ],
    },
    {
      icon: <Upload className="w-8 h-8" />,
      title: "Upload Your Tasks",
      content: [
        "Upload CSV files with your tasks or choose from Google Cluster presets.",
        "Set task parameters and enable charts if needed.",
      ],
      list: [
        "Upload custom CSV files with task details.",
        "Choose from 30 Google Cluster preset options.",
        "Set the number of tasks.",
        "Interactive charts will display automatically for single iterations.",
      ],
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "Run Your Tests",
      content: [
        "Set how many times to run the test for reliable results.",
        "Compare EACO vs EPSO algorithms with real-time animation (single run only).",
      ],
      list: [
        "Choose test runs (50+ recommended for statistical analysis).",
        "System will test both EACO and EPSO algorithms.",
        "Watch live task scheduling animation (works with single run).",
        "Track progress across multiple test runs.",
      ],
    },
    {
      icon: <LineChart className="w-8 h-8" />,
      title: "View Results & History",
      content: [
        "See detailed performance analysis with statistical comparisons.",
        "Access your saved test history and export results.",
      ],
      list: [
        "View test details, analysis, charts, and execution logs",
        "Get statistical significance results with t-tests",
        "See interactive Apache ECharts performance visualizations",
        "Browse your test history and export data",
      ],
    },
  ];

  const footerLinks = [
    {
      text: "Check on Github",
      href: "https://github.com/Thesis-It-PLSE1117/Final-Thesis-System-Repo.git",
      icon: <FaGithub size={20} />,
    },
    {
      text: "User Guide & Docs",
      href: "#",
      icon: <BookOpen size={18} />,
      onClick: () => {
        setSimulationInitialTab("help");
        setShowSimulation(true);
      },
    },
    {
      text: "Know the Team",
      href: "#",
      icon: <Users size={18} />,
      onClick: () => setIsAboutModalOpen(true),
    },
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

      <HeroSection 
        onStartSimulation={() => setShowSimulation(true)}
        onViewDocs={() => {
          setSimulationInitialTab("help");
          setShowSimulation(true);
        }}
      />

      <DemoSection
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        controls={controls}
      />

      <WalkthroughSection walkthroughSteps={walkthroughSteps} />

      <CtaSection onStartSimulation={() => setShowSimulation(true)} />

      <Footer footerLinks={footerLinks} />

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
