import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import WorkloadConfigCard from './WorkloadConfigCard';
import WorkloadUploadCard from './WorkloadUploadCard';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import MatlabToggle from './MatlabToggle';

const WorkloadTab = ({
  config,
  onChange,
  onFileUpload,
  workloadFile,
  csvRowCount,
  onPresetSelect,
  selectedPreset,
  enableMatlabPlots,
  onMatlabToggle,
  iterations
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const presetOptions = [
    { label: 'Select a preset workload...', value: '' },
    ...Array.from({ length: 30 }, (_, i) => ({
      label: `Google Cluster Subset ${i + 1}`,
      value: `final_cluster_${i + 1}.csv`
    }))
  ];

  const handleClearWorkload = () => {
    setShowDeleteModal(true);
  };

  const confirmClearWorkload = () => {
    onFileUpload({ target: { files: [] } });
    onPresetSelect('');
    setShowDeleteModal(false);
  };

  const cancelClearWorkload = () => {
    setShowDeleteModal(false);
  };

  return (
    <motion.div 
      className="max-w-4xl mx-auto relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex border-b border-[#319694]/20 mb-8">
        <motion.button
          className={`py-3 px-6 font-medium flex items-center gap-2 transition-all text-[#319694] border-b-2 border-[#319694]`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <Upload size={18} />
          Upload Workload
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
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
            onPresetSelect={onPresetSelect}
            selectedPreset={selectedPreset}
            presetOptions={presetOptions}
            onClearWorkload={handleClearWorkload}
          />
        </div>
      </motion.div>

      {/* MATLAB Visualization Toggle */}
      <div className="mt-6 mb-6">
        <MatlabToggle 
          enabled={enableMatlabPlots} 
          onChange={onMatlabToggle}
          disabled={iterations > 1}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          onConfirm={confirmClearWorkload}
          onCancel={cancelClearWorkload}
          fileType={workloadFile ? 'uploaded file' : 'selected preset'}
        />
      )}
    </motion.div>
  );
};

export default WorkloadTab;