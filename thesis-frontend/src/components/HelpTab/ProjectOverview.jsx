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
      content: (
        <>
          This system compares two cloud algorithms: <span className="font-semibold">EPSO</span> and <span className="font-semibold">EACO</span>. 
          It uses the <span className="font-semibold">CloudSim framework</span> with real Google Cluster data to test how they balance loads.
        </>
      )
    },
    {
      title: "Performance Metrics",
      icon: <BarChart2 className="w-5 h-5" />,
      subsections: [
        {
          title: "1. Response Time",
          content: (
            <>
              How long each task takes from start to finish. <span className="font-semibold">Lower response time</span> means faster results. 
              This measures how quickly the system responds to your tasks.
            </>
          )
        },
        {
          title: "2. Resource Utilization", 
          content: (
            <>
              How well your virtual machines use CPU and memory. <span className="font-semibold">Higher percentages</span> mean you're using resources efficiently. 
              Low utilization wastes available computing power.
            </>
          )
        },
        {
          title: "3. Energy Efficiency",
          content: (
            <>
              Total power used while running tasks. The system tracks both <span className="font-semibold">active power (215W)</span> and <span className="font-semibold">idle power (162W)</span>. 
              Lower energy means greener, more cost-effective computing.
            </>
          )
        },
        {
          title: "4. Degree of Imbalance (DI)",
          content: (
            <>
              Shows how evenly work is spread across your virtual machines. <span className="font-semibold">Lower numbers</span> mean better balance. 
              High imbalance means some VMs work harder than others.
            </>
          )
        },
        {
          title: "5. Makespan",
          content: (
            <>
              The total time to finish all your tasks. Think of it as the finish time of the slowest VM. 
              <span className="font-semibold">Shorter makespan</span> means your algorithm schedules work more efficiently.
            </>
          )
        }
      ]
    },

    {
      title: "System Architecture",
      icon: <BarChart2 className="w-5 h-5" />,
      content: (
        <>
          <span className="font-semibold">CloudSim-based</span> simulation framework with Spring Boot backend and React frontend. 
          <span className="font-semibold">CustomBroker</span> class inherits from CloudSim's DatacenterBroker and implements 
          <span className="font-semibold">ISchedulingAlgorithm</span> interface. Apache ECharts provides interactive visualization and statistical analysis of results.
        </>
      ),
      subsections: [
        {
          title: "Core Components",
          content: (
            <>
              <span className="font-semibold">CustomBroker</span> governs task and VM assignment. 
              <span className="font-semibold">EnhancedACO</span> and <span className="font-semibold">EnhancedPSO</span> implement ISchedulingAlgorithm interface. 
              <span className="font-semibold">DataCenterConfigurator</span> manages simulation setup with hosts, VMs, and power models.
            </>
          )
        },
        {
          title: "Technology Stack",
          content: (
            <>
              <span className="font-semibold">Backend:</span> Spring Boot + CloudSim core. 
              <span className="font-semibold">Frontend:</span> React.js + Apache ECharts for visualization. 
              <span className="font-semibold">Data:</span> Google Cluster Dataset preprocessing with Python + pandas/numpy.
            </>
          )
        }
      ]
    },
    {
      title: "Research Approach",
      icon: <HelpCircle className="w-5 h-5" />,
      content: (
        <>
          <span className="font-semibold">Quantitative, simulation-based</span> research design with expert evaluation. 
          <span className="font-semibold">30 participants:</span> 15 IT experts and 15 end users 
          (11 cloud specialists + 4 academic professionals). <span className="font-semibold">Purposive sampling</span> method ensures relevant expertise.
        </>
      ),
      subsections: [
        {
          title: "System Evaluation Methodology",
          content: (
            <>
              <span className="font-semibold">Likert scale</span> with four response options: <span className="font-semibold">4</span> (Strongly Agree, 3.26–4.00), 
              <span className="font-semibold">3</span> (Agree, 2.51–3.25), <span className="font-semibold">2</span> (Disagree, 1.76–2.50), 
              <span className="font-semibold">1</span> (Strongly Disagree, 1.00–1.75). <span className="font-semibold">Median scores</span> used for stability with small groups.
            </>
          )
        }
      ]
    },
    {
      title: "Ethics & Data Handling",
      icon: <BookOpen className="w-5 h-5" />,
      content: (
        <>
          <span className="font-semibold">Voluntary participation</span> with <span className="font-semibold">informed consent</span>. 
          <span className="font-semibold">Confidentiality</span> maintained throughout evaluation. Survey responses administered via <span className="font-semibold">Google Forms</span>—this app does not store user data. 
          Results validated through expert feedback from <span className="font-semibold">cloud specialists and IT professionals</span>.
        </>
      )
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
          <Zap className="text-gray-700 animate-pulse" size={24} />
        </div>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-900">
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
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >
              <motion.button
                whileHover={{ backgroundColor: "#f9fafb" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleSection(index)}
                className={`w-full p-5 text-left flex items-center justify-between transition-colors ${
                  activeSections[index] ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-gray-700">{section.icon}</div>
                  <h3 className="font-medium text-gray-900">{section.title}</h3>
                </div>
                <motion.div
                  animate={{ rotate: activeSections[index] ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="text-gray-400" />
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
                          className="text-gray-700 mb-4"
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
                              className="pl-4 border-l-2 border-gray-200"
                            >
                              <h4 className="font-medium text-gray-900">{sub.title}</h4>
                              <p className="text-sm text-gray-700 mt-1">{sub.content}</p>
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
