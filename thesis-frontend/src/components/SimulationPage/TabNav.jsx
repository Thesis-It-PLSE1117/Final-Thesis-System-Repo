import React from 'react';
import { Settings, Play, Repeat, BarChart2, Info } from 'lucide-react';

/**
 * tab nav just move it
 */
const TabNav = ({ activeTab, onChange }) => {
  const tabs = [
    { id: 'dataCenter', label: 'Data Center', icon: Settings },
    { id: 'iterations', label: 'Iterations', icon: Repeat },
    { id: 'workload', label: 'Workload', icon: Play },
    { id: 'history', label: 'History', icon: BarChart2 },
    { id: 'help', label: 'Help', icon: Info }
  ];

  return (
    <div className="flex border-b border-gray-200 px-6" role="tablist" aria-label="Simulation sections">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`${tab.id}-panel`}
            id={`${tab.id}-tab`}
            className={`
              py-4 px-6 font-medium flex items-center gap-2 transition-colors
              ${isActive 
                ? 'text-[#319694] border-b-2 border-[#319694]' 
                : 'text-gray-500 hover:text-gray-700'
              }
            `}
            onClick={() => onChange(tab.id)}
          >
            <Icon size={18} aria-hidden="true" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default TabNav;
