const HistoryCard = ({ result, isSelected, onClick }) => {
  const date = new Date(result.timestamp);
  const formattedDate = date.toLocaleString();
  
  // Handle cases where summary might be undefined
  const makespan = result.summary?.makespan || 0;
  const config = result.config || {};
  
  return (
    <div
      onClick={onClick}
      className={`p-4 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors ${
        isSelected ? 'bg-[#e0f7f6]' : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-gray-800">
          {result.algorithm || 'Run'} #{result.id}
        </h4>
        <span className="text-xs text-gray-500">{formattedDate}</span>
      </div>
      <div className="mt-2 flex justify-between text-sm">
        <span className="text-gray-600">
          {config.numHosts || 0} Hosts, {config.numVMs || 0} VMs
        </span>
        <span className="font-medium text-[#319694]">
          {makespan > 0 ? `${makespan.toFixed(2)} ms` : 'N/A'}
        </span>
      </div>
    </div>
  );
};

export default HistoryCard;