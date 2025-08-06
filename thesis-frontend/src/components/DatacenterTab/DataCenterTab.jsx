import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { 
  Cpu, MemoryStick, Database, Network, HardDrive, Server, Gauge, HardDriveDownload, 
  HardDriveUpload, Disc, Play 
} from 'lucide-react';
import ConfigSection from './ConfigSection';
import InputField from './InputField';
import VMCard from './VMCard';
import HostCard from './HostCard';
import MatlabToggle from './MatlabToggle';

const DataCenterTab = ({ config, onChange, enableMatlabPlots, onMatlabToggle, onRunSimulation }) => {
  const [vmCards, setVmCards] = useState([]);
  const [hostVisualization, setHostVisualization] = useState([]);
  const [expandedHost, setExpandedHost] = useState(null);
  const [expandedSection, setExpandedSection] = useState({
    hostConfig: true,
    vmConfig: false,
    distribution: false,
    preview: false
  });

  const toggleSection = (section) => {
    setExpandedSection(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Generate VM cards
  useEffect(() => {
    const cards = [];
    for (let i = 0; i < config.numVMs; i++) {
      cards.push(
        <VMCard 
          key={i}
          vmId={i}
          vmMips={config.vmMips}
          vmRam={config.vmRam}
          vmSize={config.vmSize}
          vmBw={config.vmBw}
          vmPes={config.vmPes}
        />
      );
    }
    setVmCards(cards);
  }, [config.numVMs, config.vmMips, config.vmRam, config.vmSize, config.vmBw, config.vmPes]);

  // Generate host visualization
  useEffect(() => {
    const hosts = [];
    const vmsPerHost = Math.ceil(config.numVMs / config.numHosts);
    
    for (let hostId = 0; hostId < config.numHosts; hostId++) {
      const startVM = hostId * vmsPerHost;
      const endVM = Math.min(startVM + vmsPerHost, config.numVMs);
      const hostVMs = [];
      
      for (let vmId = startVM; vmId < endVM; vmId++) {
        hostVMs.push(
          <motion.div 
            key={vmId} 
            className="bg-[#f0fdfa] p-2 rounded-md shadow-xs border border-[#319694]/10 text-xs cursor-pointer hover:bg-[#e0f8f6] transition-colors"
            whileHover={{ scale: 1.03 }}
            onClick={() => setExpandedHost(expandedHost === vmId ? null : vmId)}
          >
            <div className="flex items-center">
              <HardDrive className="text-[#319694] mr-1" size={12} />
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
        />
      );
    }
    
    setHostVisualization(hosts);
  }, [config.numHosts, config.numVMs, config.numPesPerHost, config.ramPerHost, 
      config.peMips, config.bwPerHost, config.storagePerHost, expandedHost, 
      config.vmMips, config.vmRam, config.vmPes, config.vmBw]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Host Configuration Panel */}
      <ConfigSection 
        title="Host Configuration" 
        icon={Server} 
        expanded={expandedSection.hostConfig} 
        onToggle={() => toggleSection('hostConfig')}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField 
            label="Number of Hosts" 
            name="numHosts" 
            value={config.numHosts} 
            onChange={onChange}
            icon={Server}
          />
          <InputField 
            label="PEs per Host" 
            name="numPesPerHost" 
            value={config.numPesPerHost} 
            onChange={onChange}
            icon={Cpu}
          />
          <InputField 
            label="PE MIPS" 
            name="peMips" 
            value={config.peMips} 
            onChange={onChange}
            icon={Gauge}
            unit="MIPS"
          />
          <InputField 
            label="RAM per Host" 
            name="ramPerHost" 
            value={config.ramPerHost} 
            onChange={onChange}
            icon={MemoryStick}
            unit="MB"
          />
          <InputField 
            label="Bandwidth per Host" 
            name="bwPerHost" 
            value={config.bwPerHost} 
            onChange={onChange}
            icon={Network}
            unit="MBps"
          />
          <InputField 
            label="Storage per Host" 
            name="storagePerHost" 
            value={config.storagePerHost} 
            onChange={onChange}
            icon={Disc}
            unit="MB"
          />
        </div>
      </ConfigSection>

      {/* VM Configuration Panel */}
      <ConfigSection 
        title="VM Configuration" 
        icon={HardDrive} 
        expanded={expandedSection.vmConfig} 
        onToggle={() => toggleSection('vmConfig')}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField 
            label="Number of VMs" 
            name="numVMs" 
            value={config.numVMs} 
            onChange={onChange}
            icon={HardDrive}
          />
          <InputField 
            label="VM MIPS" 
            name="vmMips" 
            value={config.vmMips} 
            onChange={onChange}
            icon={Gauge}
            unit="MIPS"
          />
          <InputField 
            label="VM PEs" 
            name="vmPes" 
            value={config.vmPes} 
            onChange={onChange}
            icon={Cpu}
          />
          <InputField 
            label="VM RAM" 
            name="vmRam" 
            value={config.vmRam} 
            onChange={onChange}
            icon={MemoryStick}
            unit="MB"
          />
          <InputField 
            label="VM Bandwidth" 
            name="vmBw" 
            value={config.vmBw} 
            onChange={onChange}
            icon={Network}
            unit="MBps"
          />
          <InputField 
            label="VM Size" 
            name="vmSize" 
            value={config.vmSize} 
            onChange={onChange}
            icon={Database}
            unit="MB"
          />
        </div>
      </ConfigSection>

      {/* Host-VM Distribution */}
      <ConfigSection 
        title="Host-VM Distribution" 
        icon={HardDriveUpload} 
        expanded={expandedSection.distribution} 
        onToggle={() => toggleSection('distribution')}
      >
        <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
            {hostVisualization}
          </div>
        </div>
      </ConfigSection>

      {/* Virtual Machines Preview */}
      <ConfigSection 
        title="Virtual Machines Preview" 
        icon={HardDriveDownload} 
        expanded={expandedSection.preview} 
        onToggle={() => toggleSection('preview')}
      >
        <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-1">
            {vmCards}
          </div>
        </div>
      </ConfigSection>

      {/* MATLAB Visualization Toggle */}
      <div className="mt-6 mb-6">
        <MatlabToggle 
          enabled={enableMatlabPlots} 
          onChange={onMatlabToggle}
        />
      </div>
    </div>
  );
};

export default DataCenterTab;