import { motion } from "framer-motion";

const VMCard = ({
  vmId,
  isActive,
  taskCount,
  cpuLoad,
  dataCenterConfig,
  status,
  getStatusColor,
  isCompactView = false,
}) => {
  const cpuPercentage = Math.max(0, cpuLoad * 100);
  
  if (isCompactView) {
    return (
      <CompactVMCard
        vmId={vmId + 1}
        isActive={isActive}
        taskCount={taskCount}
        cpuPercentage={cpuPercentage}
        cpuLoad={cpuLoad}
        status={status}
        getStatusColor={getStatusColor}
      />
    );
  }

  return (
    <DetailedVMCard
      vmId={vmId + 1}
      isActive={isActive}
      taskCount={taskCount}
      cpuPercentage={cpuPercentage}
      cpuLoad={cpuLoad}
      dataCenterConfig={dataCenterConfig}
      status={status}
      getStatusColor={getStatusColor}
    />
  );
};

const CompactVMCard = ({
  vmId,
  isActive,
  taskCount,
  cpuPercentage,
  cpuLoad,
  status,
  getStatusColor,
}) => (
  <motion.div
    className={`relative p-3 rounded-lg border transition-all ${
      isActive
        ? "bg-white border-blue-200 shadow-sm"
        : "bg-gray-50 border-gray-200 text-gray-500"
    }`}
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${
          isActive ? "bg-blue-500" : "bg-gray-400"
        }`} />
        <span className="font-medium text-sm text-gray-800">VM {vmId}</span>
      </div>
      <span className={`text-xs px-1.5 py-0.5 rounded ${
        isActive ? "bg-blue-50 text-blue-700" : "bg-gray-200 text-gray-600"
      }`}>
        {taskCount} task{taskCount !== 1 ? 's' : ''}
      </span>
    </div>
    
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-1">
        <div className={`w-1.5 h-1.5 rounded-full ${
          cpuPercentage > 80 ? "bg-red-400" : 
          cpuPercentage > 60 ? "bg-amber-400" : 
          "bg-emerald-400"
        }`} />
        <span className={isActive ? "text-gray-700" : "text-gray-500"}>
          {cpuPercentage.toFixed(0)}% ({cpuLoad.toFixed(2)})
        </span>
      </div>
      <span className={`px-1.5 py-0.5 rounded text-xs ${
        isActive ? getStatusColor(status) : 'bg-gray-200 text-gray-600'
      }`}>
        {status}
      </span>
    </div>
  </motion.div>
);

const DetailedVMCard = ({
  vmId,
  isActive,
  taskCount,
  cpuPercentage,
  cpuLoad,
  dataCenterConfig,
  status,
  getStatusColor,
}) => (
  <motion.div
    className={`relative p-4 rounded-xl border transition-all ${
      isActive
        ? "bg-white border-blue-200 shadow-sm"
        : "bg-gray-50 border-gray-200 text-gray-500"
    }`}
    whileHover={{ scale: 1.01 }}
  >
    {/* Header */}
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-md ${
          isActive ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-500"
        }`}>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
            />
          </svg>
        </div>
        <span className="font-semibold text-gray-800">VM {vmId}</span>
      </div>
      <span className={`text-sm px-2 py-1 rounded ${
        isActive ? "bg-blue-50 text-blue-700" : "bg-gray-200 text-gray-600"
      }`}>
        {dataCenterConfig.vmPes} PE{dataCenterConfig.vmPes !== 1 ? 's' : ''}
      </span>
    </div>

    {isActive ? (
      <div className="space-y-3">
        {/* CPU Utilization */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">CPU Load</span>
            <span className="font-medium text-gray-800">
              {cpuPercentage.toFixed(0)}% ({cpuLoad.toFixed(2)})
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <motion.div
              className={`h-1.5 rounded-full ${
                cpuPercentage > 80 ? "bg-red-400" : 
                cpuPercentage > 60 ? "bg-amber-400" : 
                "bg-emerald-400"
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(cpuPercentage, 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center text-sm">
          <div>
            <div className="text-gray-600">Workload</div>
            <div className="font-semibold text-gray-800">
              {taskCount} task{taskCount !== 1 ? 's' : ''}
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-gray-600 mb-1">Status</div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(status)}`}>
              {status}
            </span>
          </div>
        </div>
      </div>
    ) : (
      <div className="text-center py-3">
        <svg
          className="w-6 h-6 mx-auto text-gray-400 mb-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
          />
        </svg>
        <p className="text-xs text-gray-500">Inactive</p>
      </div>
    )}
  </motion.div>
);

export default VMCard;