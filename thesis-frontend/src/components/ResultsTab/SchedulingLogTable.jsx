import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { FiSettings, FiPlay, FiCheckCircle, FiAlertTriangle, FiLayers } from 'react-icons/fi';

const SchedulingLogTable = ({ logs, algorithm }) => {
  const statistics = useMemo(() => {
    if (!logs || logs.length === 0) return null;

    const stats = {
      totalEvents: logs.length,
      assignments: 0,
      starts: 0,
      completions: 0,
      overloads: 0,
      uniqueVMs: new Set(),
      uniqueCloudlets: new Set()
    };

    logs.forEach(log => {
      switch(log.type) {
        case 'assignment':
          stats.assignments++;
          if (log.vmId !== undefined) stats.uniqueVMs.add(log.vmId);
          if (log.cloudletId !== undefined) stats.uniqueCloudlets.add(log.cloudletId);
          break;
        case 'start':
          stats.starts++;
          break;
        case 'complete':
          stats.completions++;
          break;
        case 'overload':
          stats.overloads++;
          break;
      }
    });

    return stats;
  }, [logs]);

  const getEventColor = (type) => {
    switch(type) {
      case 'configuration':
        return 'border-l-4 border-gray-400 bg-gray-50';
      case 'assignment':
        return '';
      case 'start':
        return 'border-l-4 border-[#319694]/50 bg-[#319694]/5';
      case 'complete':
        return 'border-l-4 border-[#319694] bg-[#319694]/10';
      case 'overload':
        return 'border-l-4 border-gray-800 bg-gray-100';
      default:
        return '';
    }
  };

  const getEventIcon = (type) => {
    switch(type) {
      case 'configuration':
        return <FiSettings className="w-4 h-4 text-gray-600" />;
      case 'assignment':
        return <FiLayers className="w-4 h-4 text-gray-500" />;
      case 'start':
        return <FiPlay className="w-4 h-4 text-[#319694]/70" />;
      case 'complete':
        return <FiCheckCircle className="w-4 h-4 text-[#319694]" />;
      case 'overload':
        return <FiAlertTriangle className="w-4 h-4 text-gray-800" />;
      default:
        return null;
    }
  };

  if (!logs || logs.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600 font-medium">No scheduling logs available</p>
        <p className="text-gray-500 text-sm mt-1">
          {algorithm === 'rr' ? 'EACO' : 'EPSO'} algorithm has no events to display
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Statistics */}
      {statistics && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Event Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <div>
              <p className="text-xs text-gray-500">Total Events</p>
              <p className="text-lg font-bold text-gray-800">{statistics.totalEvents}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Assignments</p>
              <p className="text-lg font-bold text-gray-700">{statistics.assignments}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Completions</p>
              <p className="text-lg font-bold text-[#319694]">{statistics.completions}</p>
            </div>
            {statistics.overloads > 0 && (
              <div>
                <p className="text-xs text-gray-500">Overloads</p>
                <p className="text-lg font-bold text-gray-900">{statistics.overloads}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500">Active VMs</p>
              <p className="text-lg font-bold text-gray-800">{statistics.uniqueVMs.size}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Tasks</p>
              <p className="text-lg font-bold text-gray-800">{statistics.uniqueCloudlets.size}</p>
            </div>
          </div>
        </div>
      )}

      {/* Event Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time (s)</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VM ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log, index) => (
              <motion.tr 
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: Math.min(index * 0.01, 0.3) }}
                className={getEventColor(log.type)}
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getEventIcon(log.type)}
                    <span className="text-sm font-medium capitalize text-gray-700">
                      {log.type || 'event'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {log.submissionTime !== null && log.submissionTime !== undefined 
                    ? log.submissionTime.toFixed(2) 
                    : '0.00'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {log.vmId !== null && log.vmId !== undefined ? log.vmId : '-'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {log.cloudletId !== null && log.cloudletId !== undefined ? log.cloudletId : '-'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {log.description || `${log.type} event`}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SchedulingLogTable;