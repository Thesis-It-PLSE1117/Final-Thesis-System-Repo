import { useState } from 'react';
import { Settings, Play, Repeat, BarChart2, Info, ChevronDown } from 'lucide-react';

const TabNav = ({ activeTab, onChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const tabs = [
    { id: 'dataCenter', label: 'Data Center', icon: Settings },
    { id: 'iterations', label: 'Iterations', icon: Repeat },
    { id: 'workload', label: 'Workload', icon: Play },
    { id: 'history', label: 'History', icon: BarChart2 },
    { id: 'help', label: 'Help', icon: Info }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);
  const ActiveIcon = activeTabData?.icon || Settings;

  return (
    <div className="relative">
      {/* Mobile dropdown button */}
      <div className="lg:hidden">
        <button
          className="w-full flex items-center justify-between p-4 border-b border-gray-200 bg-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-haspopup="true"
          aria-label="Open menu"
        >
          <div className="flex items-center gap-2">
            <ActiveIcon size={18} aria-hidden="true" />
            <span className="font-medium">{activeTabData?.label}</span>
          </div>
          <ChevronDown 
            size={18} 
            className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} 
            aria-hidden="true" 
          />
        </button>
        
        {/* Dropdown menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-10">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  role="menuitem"
                  className={`
                    w-full py-3 px-6 font-medium flex items-center gap-2 transition-colors
                    ${isActive 
                      ? 'text-[#319694] bg-gray-50' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }
                  `}
                  onClick={() => {
                    onChange(tab.id);
                    setIsMenuOpen(false);
                  }}
                >
                  <Icon size={18} aria-hidden="true" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Desktop tab navigation */}
      <div className="hidden lg:flex border-b border-gray-200 px-6" role="tablist" aria-label="Simulation sections">
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
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabNav;