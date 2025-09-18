import { Cpu, Settings, Info } from 'lucide-react';

const CloudletToggle = ({ enabled, onChange, defaultValue, disabled = false, hasWorkload = false }) => {
  const getStatusText = () => {
    if (hasWorkload) {
      return 'Cloudlet count is determined by the uploaded workload file';
    }
    return disabled 
      ? 'Cloudlet configuration is not available' 
      : enabled
        ? 'Customize cloudlet numbers for your simulation'
        : `Standard default: ${defaultValue} cloudlets`;
  };

  // Allow toggling when there's no valid workload (csvRowCount === 0)
  const isToggleable = !disabled && !hasWorkload;

  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border ${!isToggleable ? 'border-gray-100 opacity-60' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Cpu className={!isToggleable ? "text-gray-400" : "text-[#319694]"} size={24} />
          <div>
            <h3 className={`text-lg font-semibold ${!isToggleable ? 'text-gray-600' : 'text-gray-900'}`}>
              Cloudlet Configuration Control
            </h3>
            <p className="text-sm text-gray-600">
              {getStatusText()}
            </p>
          </div>
        </div>
        <label className={`relative inline-flex items-center ${!isToggleable ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
          <input
            type="checkbox"
            checked={enabled && isToggleable}
            onChange={(e) => onChange(e.target.checked)}
            disabled={!isToggleable}
            className="sr-only peer"
          />
          <div className={`w-11 h-6 ${!isToggleable ? 'bg-gray-100' : 'bg-gray-200'} peer-focus:outline-none ${isToggleable && 'peer-focus:ring-4 peer-focus:ring-[#319694]/20'} rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${isToggleable && 'peer-checked:bg-[#319694]'} peer-disabled:opacity-50`}></div>
        </label>
      </div>
      
      {hasWorkload && (
        <div className="mt-3">
          <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-md">
            <Info className="text-orange-500" size={16} />
            <span className="text-sm text-orange-700">
              Workload file uploaded - task count determined by file
            </span>
          </div>
        </div>
      )}
      
      {enabled && isToggleable && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
            <Settings className="text-[#319694]" size={16} />
            <span className="text-sm text-gray-700">
              Custom cloudlet configuration enabled
            </span>
          </div>

          <div className="p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> You can now customize the number of cloudlets in the configuration below. 
              This allows for fine-tuned workload sizing and testing scenarios.
            </p>
          </div>
        </div>
      )}

      {!enabled && isToggleable && (
        <div className="mt-3">
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
            <Info className="text-gray-500" size={16} />
            <span className="text-sm text-gray-700">
              Using default configuration: {defaultValue} cloudlets
            </span>
          </div>
        </div>
      )}

      {!hasWorkload && !enabled && (
        <div className="mt-3">
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
            <Info className="text-gray-500" size={16} />
            <span className="text-sm text-gray-700">
              No valid workload uploaded - cloudlet configuration can be customized
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CloudletToggle;