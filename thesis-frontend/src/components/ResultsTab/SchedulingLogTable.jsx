import { motion } from 'framer-motion';
import { useMemo, useState, useCallback, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { FiSettings, FiPlay, FiCheckCircle, FiAlertTriangle, FiLayers, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const SchedulingLogTable = ({ logs, algorithm }) => {
  const [viewMode, setViewMode] = useState('virtual'); // 'virtual' or 'paginated'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;
  
  // Use virtualization for large datasets (>1000 items)
  const shouldUseVirtualization = logs && logs.length > 1000;
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

    // Optimize for large datasets by using for loop instead of forEach
    for (let i = 0; i < logs.length; i++) {
      const log = logs[i];
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
    }

    return stats;
  }, [logs]);

  const getEventColor = useCallback((type) => {
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
  }, []);

  const getEventIcon = useCallback((type) => {
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
  }, []);

  // Calculate pagination data
  const totalPages = Math.ceil((logs?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = logs?.slice(startIndex, startIndex + itemsPerPage) || [];
  
  // Virtualization setup
  const parentRef = useRef(null);
  const virtualizer = useVirtualizer({
    count: logs?.length || 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56, // Estimated row height in pixels
    overscan: 10, // Render 10 extra items for smooth scrolling
  });
  
  // Row renderer for virtualized view
  const VirtualizedRow = useCallback(({ index, style }) => {
    const log = logs[index];
    const isEven = index % 2 === 0;
    
    return (
      <div
        style={style}
        className={`flex items-center px-4 py-3 border-b border-gray-200 ${
          getEventColor(log.type)
        } ${
          isEven ? 'bg-white' : 'bg-gray-50/50'
        }`}
      >
        <div className="flex items-center gap-2 w-32">
          {getEventIcon(log.type)}
          <span className="text-sm font-medium capitalize text-gray-700">
            {log.type || 'event'}
          </span>
        </div>
        <div className="w-24 text-sm text-gray-600">
          {log.submissionTime !== null && log.submissionTime !== undefined 
            ? log.submissionTime.toFixed(2) 
            : '0.00'}
        </div>
        <div className="w-20 text-sm text-gray-600">
          {log.vmId !== null && log.vmId !== undefined ? log.vmId : '-'}
        </div>
        <div className="w-20 text-sm text-gray-600">
          {log.cloudletId !== null && log.cloudletId !== undefined ? log.cloudletId : '-'}
        </div>
        <div className="flex-1 text-sm text-gray-600">
          {log.description || `${log.type} event`}
        </div>
      </div>
    );
  }, [logs, getEventColor, getEventIcon]);

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

      {/* View Mode Toggle for large datasets */}
      {shouldUseVirtualization && (
        <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Performance Mode:</span>
            <span className="font-medium">
              {logs.length.toLocaleString()} entries detected
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('virtual')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                viewMode === 'virtual'
                  ? 'bg-[#319694] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Virtualized (Recommended)
            </button>
            <button
              onClick={() => setViewMode('paginated')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                viewMode === 'paginated'
                  ? 'bg-[#319694] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Paginated
            </button>
          </div>
        </div>
      )}
      
      {/* Event Table */}
      {shouldUseVirtualization && viewMode === 'virtual' ? (
        // Virtualized View for Large Datasets
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="flex items-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="w-32">Event</div>
              <div className="w-24">Time (s)</div>
              <div className="w-20">VM ID</div>
              <div className="w-20">Task ID</div>
              <div className="flex-1">Description</div>
            </div>
          </div>
          
          {/* Virtualized Content */}
          <div
            ref={parentRef}
            className="h-[500px] overflow-auto bg-white"
          >
            <div
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {virtualizer.getVirtualItems().map((virtualItem) => (
                <VirtualizedRow
                  key={virtualItem.key}
                  index={virtualItem.index}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Traditional Table View (for small datasets or paginated view)
        <div className="border border-gray-200 rounded-lg overflow-hidden">
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
              {(shouldUseVirtualization ? paginatedLogs : logs).map((log, index) => {
                const actualIndex = shouldUseVirtualization ? startIndex + index : index;
                return (
                  <tr 
                    key={actualIndex}
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
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {/* Pagination for large datasets in paginated mode */}
          {shouldUseVirtualization && viewMode === 'paginated' && totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, logs.length)} of {logs.length.toLocaleString()} entries
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SchedulingLogTable;