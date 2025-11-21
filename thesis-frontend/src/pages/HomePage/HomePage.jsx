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
        "Configure processing power, memory, storage, and network settings tailored to your simulation needs.",
      ],
      list: [
        "Number of hosts and their processing capacity.",
        "Virtual machine settings (CPU, RAM, Bandwidth).",
        "Host specifications (cores, RAM, storage).",
        "Preset configurations or fully custom settings.",
      ],
    },
    {
      icon: <Upload className="w-8 h-8" />,
      title: "Upload Your Tasks",
      content: [
        "Upload CSV files with your tasks or choose from Google Cluster presets.",
        "Configure task parameters and view charts for visualized results.",
      ],
      list: [
        "Upload custom CSV files with task details.",
        "Select from 10 Google Cluster preset options.",
        "Set the number of tasks for your simulation.",
        "View interactive charts automatically for single iterations.",
      ],
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "Run Your Tests",
      content: [
        "Set the number of test runs to ensure reliable, statistically significant results.",
        "Compare EACO vs EPSO algorithms with real-time animation available for single runs.",
      ],
      list: [
        "Choose test runs (50+ recommended for statistical accuracy).",
        "System tests both EACO and EPSO algorithms simultaneously, baseline algorithms as well.",
        "Watch live task scheduling animation (single run only).",
        "Track progress across multiple test iterations.",
      ],
    },

    {
      icon: <LineChart className="w-8 h-8" />,
      title: "View Saved Results",
      content: [
        "Access detailed performance analysis with statistical comparisons between algorithms.",
        "Review your complete test history and export results for further analysis.",
      ],
      list: [
        "View test details, analysis charts, and execution logs.",
        "Access statistical significance results with t-test analysis.",
        "Browse saved results and export data in multiple formats.",
      ],
    },
  ];

  const footerLinks = [
  {
    text: "View on GitHub",
    href: "https://github.com/Thesis-It-PLSE1117/Final-Thesis-System-Repo.git",
    icon: <FaGithub size={20} />,
  },
  {
    text: "User Guide & Documentation",
    href: "#",
    icon: <BookOpen size={18} />,
    onClick: () => {
      setSimulationInitialTab("help");
      setShowSimulation(true);
    },
  },
  {
    text: "Meet the Team",
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
