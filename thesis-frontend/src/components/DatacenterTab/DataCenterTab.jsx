import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { 
  Cpu, MemoryStick, Database, Network, HardDrive, Server, Gauge, 
  HardDriveDownload, HardDriveUpload, Disc, Play, MoreHorizontal, 
  ChevronDown, ChevronRight, Settings, ChevronUp, X
} from 'lucide-react';
import ConfigSection from './ConfigurationPanel';
import InputField from './InputField';
import VMCard from './VMCard';
import HostCard from './HostCard';
import PresetSelector from './PresetSelector';
import ConfigurationPanel from './ConfigurationPanel';
import VisualizationSection from './VisualizationSection';

const DataCenterTab = ({ config, onChange, presetConfigs, selectedPreset, clearPreset, applyPreset }) => {
  const [vmCards, setVmCards] = useState([]);
  const [hostVisualization, setHostVisualization] = useState([]);
  const [expandedHost, setExpandedHost] = useState(null);
  const [presetDropdownOpen, setPresetDropdownOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState({
    hostConfig: true,
    vmConfig: true,
    distribution: false,
    preview: false
  });

  // Limit the number of displayed hosts and VMs
  const MAX_DISPLAY_HOSTS = 20;
  const MAX_DISPLAY_VMS = 20;

  const toggleSection = (section) => {
    setExpandedSection(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Convert empty string to 0 or keep the numeric value
    const numericValue = value === '' ? 0 : Number(value);
    onChange({
      target: {
        name,
        value: numericValue
      }
    });
  };

  // Handle preset selection - use the passed applyPreset function or fallback to onChange
  const handlePresetSelect = (presetName) => {
    setPresetDropdownOpen(false);
    if (applyPreset) {
      applyPreset(presetName);
    } else {
      onChange({
        target: {
          name: 'applyPreset',
          value: presetName
        }
      });
    }
  };

  // Handle clearing preset - use the passed clearPreset function or fallback to onChange
  const handleClearPreset = () => {
    setPresetDropdownOpen(false);
    if (clearPreset) {
      clearPreset();
    } else {
      onChange({
        target: {
          name: 'applyPreset',
          value: null
        }
      });
    }
  };

  // Generate VM cards with limitation
  useEffect(() => {
    const cards = [];
    const displayVmCount = Math.min(config.numVMs, MAX_DISPLAY_VMS);
    
    for (let i = 0; i < displayVmCount; i++) {
      cards.push(
        <VMCard 
          key={i}
          vmId={i}
          vmMips={config.vmMips}
          vmRam={config.vmRam}
          vmSize={config.vmSize}
          vmBw={config.vmBw}
          vmPes={config.vmPes}
          isCompact={true}
        />
      );
    }
    
    // Add indicator if there are more VMs than displayed
    if (config.numVMs > MAX_DISPLAY_VMS) {
      cards.push(
        <div key="more-vms" className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 text-gray-500">
          <MoreHorizontal size={24} className="mb-1" />
          <p className="text-xs font-medium">{config.numVMs - MAX_DISPLAY_VMS} more VMs</p>
          <p className="text-xs">Total: {config.numVMs} VMs</p>
        </div>
      );
    }
    
    setVmCards(cards);
  }, [config.numVMs, config.vmMips, config.vmRam, config.vmSize, config.vmBw, config.vmPes]);

  // Generate host visualization with limitation - FIXED DISTRIBUTION
  useEffect(() => {
    const hosts = [];
    const displayHostCount = Math.min(config.numHosts, MAX_DISPLAY_HOSTS);
    
    // Calculate VMs per host using CloudSim-like distribution
    const vmsPerHost = Math.floor(config.numVMs / config.numHosts);
    const remainingVMs = config.numVMs % config.numHosts;
    
    for (let hostId = 0; hostId < displayHostCount; hostId++) {
      // Distribute VMs - first 'remainingVMs' hosts get one extra VM
      const vmsInThisHost = hostId < remainingVMs ? vmsPerHost + 1 : vmsPerHost;
      
      const hostVMs = [];
      // Calculate starting VM ID for this host
      let startVM = 0;
      for (let i = 0; i < hostId; i++) {
        startVM += (i < remainingVMs) ? vmsPerHost + 1 : vmsPerHost;
      }
      
      // Limit VMs per host for display
      const maxVmsPerHostDisplay = 6;
      const displayVmsCount = Math.min(vmsInThisHost, maxVmsPerHostDisplay);
      
      for (let i = 0; i < displayVmsCount; i++) {
        const vmId = startVM + i;
        hostVMs.push(
          <motion.div 
            key={vmId} 
            className="bg-[#f0fdfa] p-1 rounded border border-[#319694]/10 text-xs cursor-pointer hover:bg-[#e0f8f6] transition-colors"
            whileHover={{ scale: 1.03 }}
            onClick={() => setExpandedHost(expandedHost === vmId ? null : vmId)}
          >
            <div className="flex items-center">
              <HardDrive className="text-[#319694] mr-1" size={10} />
              <span>VM {vmId + 1}</span>
            </div>
            <AnimatePresence>
              {expandedHost === vmId && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-1 text-xs text-gray-600 overflow-hidden"
                >
                  <div className="flex justify-between">
                    <span>MIPS: {config.vmMips}</span>
                    <span>RAM: {config.vmRam}MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PEs: {config.vmPes}</span>
                    <span>BW: {config.vmBw}MBps</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      }
      
      // Add indicator if there are more VMs in this host than displayed
      if (vmsInThisHost > maxVmsPerHostDisplay) {
        hostVMs.push(
          <div key={`more-${hostId}`} className="text-center p-1 bg-gray-100 rounded border border-gray-200 text-xs text-gray-500">
            +{vmsInThisHost - maxVmsPerHostDisplay} more
          </div>
        );
      }
      
      hosts.push(
        <HostCard
          key={hostId}
          hostId={hostId}
          numPesPerHost={config.numPesPerHost}
          ramPerHost={config.ramPerHost}
          peMips={config.peMips}
          bwPerHost={config.bwPerHost}
          storagePerHost={config.storagePerHost}
          vms={hostVMs}
          totalVms={vmsInThisHost}
          isCompact={true}
        />
      );
    }
    
    // Add indicator if there are more hosts than displayed
    if (config.numHosts > MAX_DISPLAY_HOSTS) {
      hosts.push(
        <div key="more-hosts" className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 text-gray-500">
          <MoreHorizontal size={24} className="mb-1" />
          <p className="text-xs font-medium">{config.numHosts - MAX_DISPLAY_HOSTS} more hosts</p>
          <p className="text-xs">Total: {config.numHosts} hosts</p>
        </div>
      );
    }
    
    setHostVisualization(hosts);
  }, [config.numHosts, config.numVMs, config.numPesPerHost, config.ramPerHost, 
      config.peMips, config.bwPerHost, config.storagePerHost, expandedHost, 
      config.vmMips, config.vmRam, config.vmPes, config.vmBw]);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar with Preset Configurations */}
      <div className="lg:w-1/4">
        <PresetSelector
          presetConfigs={presetConfigs}
          selectedPreset={selectedPreset}
          presetDropdownOpen={presetDropdownOpen}
          setPresetDropdownOpen={setPresetDropdownOpen}
          handlePresetSelect={handlePresetSelect}
          clearPreset={handleClearPreset}
        />
      </div>

      {/* Main Content Area */}
      <div className="lg:w-3/4">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 mb-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-[#319694]/10 rounded-lg mr-3">
              <Server className="text-[#319694]" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Data Center Configuration</h3>
          </div>
          
          {/* Host Configuration Panel */}
          <ConfigurationPanel
            title="Host Configuration"
            icon={Server}
            expanded={expandedSection.hostConfig}
            toggleSection={() => toggleSection('hostConfig')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
              <InputField 
                label="Number of Hosts" 
                name="numHosts" 
                value={config.numHosts} 
                onChange={handleInputChange}
                type="number"
                min="1"
                icon={Server}
              />
              <InputField 
                label="PEs per Host" 
                name="numPesPerHost" 
                value={config.numPesPerHost} 
                onChange={handleInputChange}
                type="number"
                min="1"
                icon={Cpu}
              />
              <InputField 
                label="PE MIPS" 
                name="peMips" 
                value={config.peMips} 
                onChange={handleInputChange}
                type="number"
                min="1"
                icon={Gauge}
                unit="MIPS"
              />
              <InputField 
                label="RAM per Host" 
                name="ramPerHost" 
                value={config.ramPerHost} 
                onChange={handleInputChange}
                type="number"
                min="1"
                icon={MemoryStick}
                unit="MB"
              />
              <InputField 
                label="Bandwidth per Host" 
                name="bwPerHost" 
                value={config.bwPerHost} 
                onChange={handleInputChange}
                type="number"
                min="1"
                icon={Network}
                unit="MBps"
              />
              <InputField 
                label="Storage per Host" 
                name="storagePerHost" 
                value={config.storagePerHost} 
                onChange={handleInputChange}
                type="number"
                min="1"
                icon={Disc}
                unit="MB"
              />
            </div>
          </ConfigurationPanel>

          {/* VM Configuration Panel */}
          <ConfigurationPanel
            title="VM Configuration"
            icon={HardDrive}
            expanded={expandedSection.vmConfig}
            toggleSection={() => toggleSection('vmConfig')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
              <InputField 
                label="Number of VMs" 
                name="numVMs" 
                value={config.numVMs} 
                onChange={handleInputChange}
                type="number"
                min="0"
                icon={HardDrive}
              />
              <InputField 
                label="VM MIPS" 
                name="vmMips" 
                value={config.vmMips} 
                onChange={handleInputChange}
                type="number"
                min="1"
                icon={Gauge}
                unit="MIPS"
              />
              <InputField 
                label="VM PEs" 
                name="vmPes" 
                value={config.vmPes} 
                onChange={handleInputChange}
                type="number"
                min="1"
                icon={Cpu}
              />
              <InputField 
                label="VM RAM" 
                name="vmRam" 
                value={config.vmRam} 
                onChange={handleInputChange}
                type="number"
                min="1"
                icon={MemoryStick}
                unit="MB"
              />
              <InputField 
                label="VM Bandwidth" 
                name="vmBw" 
                value={config.vmBw} 
                onChange={handleInputChange}
                type="number"
                min="1"
                icon={Network}
                unit="MBps"
              />
              <InputField 
                label="VM Size" 
                name="vmSize" 
                value={config.vmSize} 
                onChange={handleInputChange}
                type="number"
                min="1"
                icon={Database}
                unit="MB"
              />
            </div>
          </ConfigurationPanel>
        </div>

        {/* Visualization Section */}
        <VisualizationSection
          hostVisualization={hostVisualization}
          vmCards={vmCards}
          expandedSection={expandedSection}
          toggleSection={toggleSection}
        />
      </div>
    </div>
  );
};

export default DataCenterTab;
