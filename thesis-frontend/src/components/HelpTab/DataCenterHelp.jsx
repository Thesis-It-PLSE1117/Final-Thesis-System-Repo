import { motion } from "framer-motion";
import {
  Server,
  HardDriveUpload,
  HardDriveDownload,
  Settings,
  HardDrive,
  Cpu,
  Gauge,
  MemoryStick,
  Network,
  Disc,
  AlertCircle,
  BookOpen,
  Zap,
} from "lucide-react";
import { dataCenterHelpContent } from "./dataCenterHelpData.jsx";

const iconMap = {
  Server,
  HardDriveUpload,
  HardDriveDownload,
  Settings,
  HardDrive,
  Cpu,
  Gauge,
  MemoryStick,
  Network,
  Disc,
  AlertCircle,
  BookOpen,
  Zap,
};

const getIcon = (name, props = {}) => {
  const Icon = iconMap[name] || Server;
  return <Icon {...props} />;
};

const DataCenterHelp = () => {
  const { title, description, quickStart, sections } = dataCenterHelpContent;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 pb-4 border-b border-gray-200"
      >
        {getIcon("Server", { className: "text-gray-700", size: 28 })}
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <p className="text-base text-gray-700 mt-1">{description}</p>
        </div>
      </motion.div>

      {/* Quick Start */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-50 border border-gray-200 rounded-lg p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          {getIcon("Zap", { className: "text-gray-700", size: 20 })}
          <h3 className="text-xl font-medium text-gray-900">
            {quickStart.title}
          </h3>
        </div>
        <p className="text-base text-gray-700 mb-3">{quickStart.description}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 border border-gray-200 rounded p-3">
          {Object.entries(quickStart.example).map(([key, value]) => (
            <div key={key} className="text-base">
              <span className="font-semibold text-gray-700">{value}</span>
            </div>
          ))}
        </div>
        <p className="text-base text-gray-600 mt-3 font-semibold">{quickStart.note}</p>
      </motion.div>

      {/* Host Configuration */}
      <ConfigSection section={sections.hostConfig} delay={0.2} />

      {/* VM Configuration */}
      <ConfigSection section={sections.vmConfig} delay={0.3} />

      {/* Troubleshooting */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg border border-gray-200 p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          {getIcon(sections.troubleshooting.icon, {
            className: "text-gray-700",
            size: 20,
          })}
          <h3 className="text-xl font-medium text-gray-900">
            {sections.troubleshooting.title}
          </h3>
        </div>
        <p className="text-base text-gray-600 mb-4">
          {sections.troubleshooting.description}
        </p>
        <div className="space-y-3">
          {sections.troubleshooting.items.map((item, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg p-3"
            >
              <div className="flex items-start gap-2">
                {getIcon(item.icon, {
                  className: "text-gray-700 mt-0.5",
                  size: 16,
                })}
                <div className="flex-1">
                  <p className="text-base font-medium text-gray-900">
                    {item.problem}
                  </p>
                  <p className="text-base text-gray-700 mt-1">{item.solution}</p>
                  <p className="text-base text-gray-600 mt-1">
                    <strong className="font-medium">Example:</strong> {item.example}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Glossary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg border border-gray-200 p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          {getIcon(sections.glossary.icon, {
            className: "text-gray-700",
            size: 20,
          })}
          <h3 className="text-xl font-medium text-gray-900">
            {sections.glossary.title}
          </h3>
        </div>
        <p className="text-base text-gray-600 mb-4">
          {sections.glossary.description}
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          {sections.glossary.terms.map((item, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-3">
              <p className="text-base font-medium text-gray-900">{item.term}</p>
              <p className="text-base text-gray-700 mt-1">{item.definition}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// Reusable section component (DRY principle)
const ConfigSection = ({ section, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white rounded-lg border border-gray-200 p-5"
  >
    <div className="flex items-center gap-2 mb-3">
      {getIcon(section.icon, { className: "text-gray-700", size: 20 })}
      <h3 className="text-xl font-medium text-gray-900">{section.title}</h3>
    </div>
    <p className="text-base text-gray-700 mb-4">{section.description}</p>
    <div className="space-y-2">
      {section.items.map((item, idx) => (
        <div
          key={idx}
          className="flex items-start gap-3 p-3 rounded hover:bg-gray-50 transition-colors"
        >
          {getIcon(item.icon, { className: "text-gray-600 mt-0.5", size: 18 })}
          <div className="flex-1">
            <p className="text-base font-medium text-gray-900">{item.label}</p>
            <p className="text-base text-gray-700">{item.explanation}</p>
            <div className="flex flex-wrap gap-3 mt-1">
              <span className="text-base text-gray-900 font-medium">
                {item.example}
              </span>
              <span className="text-base text-gray-600">{item.tip}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

export default DataCenterHelp;
