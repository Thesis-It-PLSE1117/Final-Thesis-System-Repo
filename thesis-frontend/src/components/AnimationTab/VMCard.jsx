import { Cpu, MemoryStick, Database, Network, HardDrive } from 'lucide-react';

const VMCard = ({ vmId, isActive, taskCount, cpuLoad, dataCenterConfig, status, getStatusColor }) => {
  const vmPes = dataCenterConfig.vmPes || 1;
  const cpuPercentage = Math.min(100, (cpuLoad / vmPes) * 100);
  const vmCapacity = dataCenterConfig.vmPes * dataCenterConfig.vmMips;

  return (
    <div 
      className={`p-4 rounded-lg shadow-sm border transition-all duration-300 ${
        isActive 
          ? status === 'Overloaded' 
            ? 'bg-red-50 border-red-200' 
            : status === 'High Load'
              ? 'bg-yellow-50 border-yellow-200'
              : 'bg-green-50 border-green-200'
          : 'bg-gray-50 border-gray-200'
      }`}
      style={{
        transform: isActive ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      <div className="flex items-center mb-2">
        <HardDrive className={`${isActive ? 'text-gray-800' : 'text-gray-500'} mr-2`} size={18} />
        <h4 className={`font-semibold ${isActive ? 'text-gray-800' : 'text-gray-700'}`}>
          VM {vmId + 1}
        </h4>
        <span className={`ml-auto text-xs px-2 py-1 rounded-full ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>

      <div className="mb-2">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>CPU Load</span>
          <span>{cpuPercentage.toFixed(1)}% ({cpuLoad.toFixed(1)}/{vmCapacity})</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              cpuPercentage > 90 ? 'bg-red-500' :
              cpuPercentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
            }`} 
            style={{ width: `${cpuPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <InfoRow icon={<Cpu size={16} />} text={`${taskCount} tasks`} />
        <InfoRow icon={<MemoryStick size={16} />} text={`${dataCenterConfig.vmRam} MB`} />
        <InfoRow icon={<Database size={16} />} text={`${dataCenterConfig.vmSize} MB`} />
        <InfoRow icon={<Network size={16} />} text={`${dataCenterConfig.vmBw} MBps`} />
      </div>
    </div>
  );
};

const InfoRow = ({ icon, text }) => (
  <div className="flex items-center text-sm text-gray-600">
    <span className="text-gray-500 mr-1">{icon}</span>{text}
  </div>
);

export default VMCard;
