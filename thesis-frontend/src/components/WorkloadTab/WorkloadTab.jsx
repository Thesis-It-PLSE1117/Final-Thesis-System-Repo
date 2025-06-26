import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Zap } from 'lucide-react';
import WorkloadConfigCard from './WorkloadConfigCard';
import WorkloadUploadCard from './WorkloadUploadCard';
import SyntheticWorkloadPanel from './SyntheticWorkloadPanel';

const WorkloadTab = ({
  config,
  onChange,
  onFileUpload,
  workloadFile,
  csvRowCount,
  onPresetSelect,
  selectedPreset,
  onSyntheticWorkloadSubmit
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');

  const presetOptions = [
    { label: 'Select a preset workload...', value: '' },
    ...Array.from({ length: 30 }, (_, i) => ({
      label: `Final Cluster ${i + 1}`,
      value: `final_cluster_${i + 1}.csv`
    }))
  ];

  return (
    <motion.div 
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex border-b border-[#319694]/20 mb-8">
        <motion.button
          className={`py-3 px-6 font-medium flex items-center gap-2 transition-all ${
            activeTab === 'upload' 
              ? 'text-[#319694] border-b-2 border-[#319694]' 
              : 'text-gray-500 hover:text-[#267b79]'
          }`}
          onClick={() => setActiveTab('upload')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <Upload size={18} />
          Upload Workload
        </motion.button>
        <motion.button
          className={`py-3 px-6 font-medium flex items-center gap-2 transition-all ${
            activeTab === 'synthetic' 
              ? 'text-[#319694] border-b-2 border-[#319694]' 
              : 'text-gray-500 hover:text-[#267b79]'
          }`}
          onClick={() => setActiveTab('synthetic')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <Zap size={18} />
          Synthetic Workload
        </motion.button>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'upload' ? (
          <div className="space-y-6">
            <WorkloadConfigCard 
              config={config}
              onChange={onChange}
              csvRowCount={csvRowCount}
              onPresetSelect={onPresetSelect}
              selectedPreset={selectedPreset}
              presetOptions={presetOptions}
            />
            
            <WorkloadUploadCard
              isDragging={isDragging}
              setIsDragging={setIsDragging}
              onFileUpload={onFileUpload}
              workloadFile={workloadFile}
              csvRowCount={csvRowCount}
            />
          </div>
        ) : (
          <SyntheticWorkloadPanel 
            onSubmit={onSyntheticWorkloadSubmit}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default WorkloadTab;