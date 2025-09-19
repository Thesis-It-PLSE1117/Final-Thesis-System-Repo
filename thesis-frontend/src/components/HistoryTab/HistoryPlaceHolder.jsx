import { Info } from 'lucide-react';

const HistoryPlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-[#319694]/15">
      <div className="bg-[#e0f7f6] p-4 rounded-full mb-4">
        <Info className="text-[#319694]" size={48} />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">No Simulation Results Yet</h3>
      <p className="text-gray-500 text-center max-w-md">
        Your EPSO and EACO simulation results will appear here. 
        Run your first simulation to start building history.
      </p>
    </div>
  );
};

export default HistoryPlaceholder;