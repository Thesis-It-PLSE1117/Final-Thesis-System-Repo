import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import WorkloadConfigCard from './WorkloadConfigCard';
import WorkloadUploadCard from './WorkloadUploadCard';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import MatlabToggle from './MatlabToggle';
import CloudletToggle from './CloudletToggle';

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
  iterations,
  cloudletToggleEnabled,
  onCloudletToggleChange,
  defaultCloudletCount,
  fileInputRef,
  clearWorkloadFile
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
    // Use the enhanced clear function passed from parent
    if (clearWorkloadFile) {
      clearWorkloadFile();
    } else {
      // Fallback to direct calls
      onFileUpload({ target: { files: [] } });
      onPresetSelect('');
      
      // Clear the file input if ref is available
      if (fileInputRef?.current) {
        fileInputRef.current.value = '';
      }
    }
    setShowDeleteModal(false);
  };

  const cancelClearWorkload = () => {
    setShowDeleteModal(false);
  };

  // Enhanced file upload handler that works with fileInputRef
  const handleFileUpload = (event) => {
    // Call the original handler
    onFileUpload(event);
    
    // If we have files and a preset was selected, clear the preset
    if (event.target.files && event.target.files.length > 0 && selectedPreset) {
      onPresetSelect('');
    }
  };

  // Enhanced preset selection handler
  const handlePresetSelect = (presetValue) => {
    // If selecting a preset and we have an uploaded file, clear it
    if (presetValue && workloadFile && fileInputRef?.current) {
      fileInputRef.current.value = '';
    }
    
    onPresetSelect(presetValue);
  };
  
  // In the WorkloadTab component, update the hasWorkload calculation:
  const hasWorkload = !!(workloadFile || selectedPreset) && csvRowCount > 0;

  return (
    <motion.div 
      className="max-w-4xl mx-auto relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-6">
          {/* Cloudlet Configuration Control */}
          <CloudletToggle 
            enabled={cloudletToggleEnabled}
            onChange={onCloudletToggleChange}
            defaultValue={defaultCloudletCount}
            hasWorkload={hasWorkload}
          />
          
          <WorkloadConfigCard 
            config={config}
            onChange={onChange}
            csvRowCount={csvRowCount}
            onPresetSelect={handlePresetSelect}
            selectedPreset={selectedPreset}
            presetOptions={presetOptions}
            cloudletToggleEnabled={cloudletToggleEnabled}
            defaultCloudletCount={defaultCloudletCount} // Make sure this is passed
          />
          
          <WorkloadUploadCard
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            onFileUpload={handleFileUpload}
            workloadFile={workloadFile}
            csvRowCount={csvRowCount}
            onPresetSelect={handlePresetSelect}
            selectedPreset={selectedPreset}
            presetOptions={presetOptions}
            onClearWorkload={handleClearWorkload}
            fileInputRef={fileInputRef}
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