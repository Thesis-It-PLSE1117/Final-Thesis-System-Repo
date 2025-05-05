import { Upload, Cloud, FileText, Database, Zap, Server, X, Gauge } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const WorkloadTab = ({
  config,
  onChange,
  onFileUpload,
  workloadFile,
  csvRowCount,
  onPresetSelect,
  selectedPreset
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const presetOptions = [
    { label: 'Select a preset workload...', value: '' },
    { label: 'Small Workload (199 tasks)', value: 'workload_small.csv' },
    { label: 'Large Workload (4833 tasks)', value: 'workload_large.csv' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      } 
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      } 
    },
    hover: {
      y: -3,
      boxShadow: "0 10px 25px -5px rgba(49, 150, 148, 0.1)",
      transition: { duration: 0.2 }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload({ target: { files: [e.dataTransfer.files[0]] } });
      onPresetSelect('');
    }
  };

  const handleClearWorkload = () => {
    onFileUpload({ target: { files: [] } });
    onPresetSelect('');
  };

  return (
    <motion.div 
      className="max-w-4xl mx-auto"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      {/* Configuration Card */}
      <motion.div 
        className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md border border-[#319694]/10 mb-8"
        variants={cardVariants}
        initial="hidden"
        animate="show"
        whileHover="hover"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#319694]/10 rounded-lg">
            <Zap className="text-[#319694]" size={20} />
          </div>
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#267b79] to-[#4fd1c5]">
            Workload Configuration
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Server size={18} className="text-[#319694]" />
              Number of Cloudlets
            </label>
            <input
              type="number"
              name="numCloudlets"
              value={config.numCloudlets}
              onChange={onChange}
              className="w-full px-4 py-2 border border-[#319694]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#319694]/30 focus:border-[#319694]/50 transition-all"
              min="1"
              max={csvRowCount > 0 ? csvRowCount : undefined}
            />
            {csvRowCount > 0 && (
              <motion.p 
                className="text-xs text-gray-500 mt-2 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Database size={14} className="text-[#319694]" />
                Max cloudlets (tasks) based on workload: {csvRowCount}
              </motion.p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FileText size={18} className="text-[#319694]" />
              Use Preset Workload
            </label>
            <select
              className="w-full px-4 py-2 border border-[#319694]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#319694]/30 focus:border-[#319694]/50 transition-all appearance-none bg-white"
              value={selectedPreset}
              onChange={(e) => onPresetSelect(e.target.value)}
            >
              {presetOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </motion.div>
        </div>
      </motion.div>

      {/* Upload Card */}
      <motion.div 
        className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md border border-[#319694]/10"
        variants={cardVariants}
        initial="hidden"
        animate="show"
        whileHover="hover"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#319694]/10 rounded-lg">
            <Cloud className="text-[#319694]" size={20} />
          </div>
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#267b79] to-[#4fd1c5]">
            Upload Your Own CSV
          </h3>
        </div>

        <div className="flex items-center justify-center w-full">
          <motion.label 
            className={`flex flex-col items-center justify-center w-full h-40 border-2 ${isDragging ? 'border-[#319694] bg-[#f0fdfa]' : 'border-[#319694]/30'} border-dashed rounded-xl cursor-pointer bg-white/50 hover:bg-[#f0fdfa] transition-all duration-200`}
            whileTap={{ scale: 0.98 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <motion.div 
                animate={{ 
                  y: isDragging ? [-3, 3, -3] : 0,
                  transition: isDragging ? { repeat: Infinity, duration: 1.5, ease: "easeInOut" } : {}
                }}
              >
                <Upload className="text-[#319694] mb-3" size={28} />
              </motion.div>
              <p className="mb-2 text-sm text-gray-600">
                <span className="font-semibold text-[#319694]">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">CSV files only</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".csv"
              onChange={(e) => {
                onFileUpload(e);
                onPresetSelect('');
              }}
            />
          </motion.label>
        </div>

        {(workloadFile || selectedPreset) && (
          <motion.div 
            className="mt-6 p-4 bg-[#f0fdfa] rounded-lg border border-[#319694]/30 flex items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="p-2 bg-white rounded-lg mr-4 border border-[#319694]/10">
              <FileText className="text-[#319694]" size={20} />
            </div>
            <div className="flex-grow">
              <p className="text-sm font-medium text-gray-800">
                {workloadFile ? workloadFile.name : presetOptions.find(p => p.value === selectedPreset)?.label}
              </p>
              <div className="flex gap-4 mt-2">
                {workloadFile && (
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <Database size={14} className="text-[#319694]" /> {(workloadFile.size / 1024).toFixed(2)} KB
                  </p>
                )}
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <Zap size={14} className="text-[#319694]" /> {csvRowCount} tasks
                </p>
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1 text-gray-400 hover:text-[#319694] rounded-full transition-colors"
              onClick={handleClearWorkload}
            >
              <X size={18} />
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* Workload Intensity Bar */}
      {csvRowCount > 0 && (
        <motion.div 
          className="mt-8 bg-white/90 backdrop-blur-sm p-5 rounded-xl shadow-md border border-[#319694]/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Gauge size={18} className="text-[#319694]" />
              Workload Intensity
            </h4>
            <span className="text-xs font-medium bg-[#319694]/10 text-[#319694] px-3 py-1 rounded-full">
              {csvRowCount} tasks
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-[#4fd1c5] to-[#319694] h-2.5 rounded-full" 
              initial={{ width: 0 }}
              animate={{ 
                width: `${Math.min(100, (csvRowCount / 5000) * 100)}%`,
                transition: { duration: 1, ease: "easeOut" }
              }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Light</span>
            <span>Medium</span>
            <span>Heavy</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WorkloadTab;