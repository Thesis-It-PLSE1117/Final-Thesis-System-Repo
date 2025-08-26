import { motion } from 'framer-motion';

const SchedulingLogTable = ({ logs, algorithm }) => {
  if (!logs || logs.length === 0) {
    return (
      <div className="text-gray-500 p-4 text-center">
        No scheduling log available for {algorithm === 'rr' ? 'EACO' : 'EPSO'}
      </div>
    );
  }

  return (
         <div className="overflow-x-auto">
       <table className="min-w-full divide-y divide-gray-200">
         <thead className="bg-gray-50">
           <tr>
             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp (s)</th>
             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VM ID</th>
             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cloudlet ID</th>
             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Type</th>
             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
           </tr>
         </thead>
         <tbody className="bg-white divide-y divide-gray-200">
           {logs.map((log, index) => (
             <motion.tr 
               key={index}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: index * 0.02 }}
               className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
             >
               <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                 {log.submissionTime?.toFixed(2) || '0.00'}
               </td>
               <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                 {log.vmId}
               </td>
               <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                 {log.cloudletId}
               </td>
               <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 capitalize">
                 {log.type || 'assignment'}
               </td>
               <td className="px-4 py-3 text-sm text-gray-500">
                 {log.description || `Cloudlet ${log.cloudletId} assigned to VM ${log.vmId}`}
               </td>
             </motion.tr>
           ))}
         </tbody>
       </table>
     </div>
  );
};

export default SchedulingLogTable;