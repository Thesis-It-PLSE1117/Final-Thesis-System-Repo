import { Cpu, MemoryStick, Database, Network, HardDrive } from 'lucide-react';

const VMCard = ({ vmId, isActive, taskCount, cpuLoad, dataCenterConfig, status, getStatusColor }) => {
  const cpuPercentage = Math.min(100, (cpuLoad * 100));
  const vmCapacity = dataCenterConfig.vmPes * dataCenterConfig.vmMips;

  return (
    <div 
      className={`p-2 sm:p-3 rounded-lg shadow-sm border transition-all duration-300 ${
        isActive 
          ? status === 'Overloaded' 
            ? 'bg-red-50 border-red-200' 
            : status === 'High Load'
              ? 'bg-yellow-50 border-yellow-200'
              : status === 'Medium Load'
                ? 'bg-orange-50 border-orange-200'
                : 'bg-green-50 border-green-200'
          : 'bg-gray-50 border-gray-200'
      }`}
      style={{
        transform: isActive ? 'scale(1.01)' : 'scale(1)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center min-w-0 flex-1">
          <HardDrive className={`${isActive ? 'text-gray-800' : 'text-gray-500'} mr-1.5 flex-shrink-0`} size={16} />
          <h4 className={`font-semibold text-sm sm:text-base ${isActive ? 'text-gray-800' : 'text-gray-700'} truncate`}>
            VM {vmId + 1}
          </h4>
        </div>
        <span className={`text-xs px-1.5 py-0.5 rounded-full whitespace-nowrap ml-2 ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>

      {/* CPU Load Bar */}
      <div className="mb-2">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span className="truncate">CPU</span>
          <span className="ml-1 whitespace-nowrap">
            {cpuPercentage.toFixed(0)}%
            <span className="hidden sm:inline"> ({(cpuLoad * vmCapacity).toFixed(0)}/{vmCapacity})</span>
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full transition-all duration-300 ${
              cpuPercentage > 90 ? 'bg-red-500' :
              cpuPercentage > 70 ? 'bg-yellow-500' : 
              cpuPercentage > 40 ? 'bg-orange-500' : 'bg-green-500'
            }`} 
            style={{ width: `${cpuPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-1 sm:gap-2">
        <InfoRow 
          icon={<Cpu size={14} />} 
          text={`${taskCount}`}
          label="tasks"
          mobile
        />
        <InfoRow 
          icon={<MemoryStick size={14} />} 
          text={`${dataCenterConfig.vmRam}`}
          label="MB"
          mobile
        />
        <InfoRow 
          icon={<Database size={14} />} 
          text={`${dataCenterConfig.vmSize}`}
          label="MB"
          mobile
        />
        <InfoRow 
          icon={<Network size={14} />} 
          text={`${dataCenterConfig.vmBw}`}
          label="MBps"
          mobile
        />
      </div>
    </div>
  );
};

const InfoRow = ({ icon, text, label, mobile }) => (
  <div className="flex items-center text-xs sm:text-sm text-gray-600 min-w-0">
    <span className="text-gray-500 mr-1 flex-shrink-0">{icon}</span>
    <span className="truncate">
      {text}
      {mobile && (
        <>
          <span className="hidden sm:inline"> {label}</span>
          <span className="sm:hidden">{label.charAt(0)}</span>
        </>
      )}
    </span>
  </div>
);

export default VMCard;