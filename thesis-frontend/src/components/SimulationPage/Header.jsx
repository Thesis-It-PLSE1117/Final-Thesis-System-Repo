import React from 'react';
import { Home, Settings, Play, Repeat, BarChart2, HelpCircle } from 'lucide-react';

/**
 * header component for SimulationPage
 */
const Header = ({ simulationState, activeTab, onBack, onGoToConfig }) => {
  const getHeaderTitle = () => {
    switch (simulationState) {
      case 'config':
        switch (activeTab) {
          case 'dataCenter': return 'Data Center Configuration';
          case 'workload': return 'Workload Configuration';
          case 'iterations': return 'Iteration Settings';
          case 'history': return 'Results History';
          case 'help': return 'Help & Documentation';
          default: return 'Simulation Configuration';
        }
      case 'loading': return 'Running Algorithm Comparison';
      case 'animation': return 'Task Scheduling Visualization';
      case 'results': return 'Performance Analysis';
      default: return 'Load Balancing Simulation';
    }
  };

  const getHeaderSubtitle = () => {
    switch (simulationState) {
      case 'config':
        switch (activeTab) {
          case 'dataCenter': return 'Configure your data center infrastructure';
          case 'workload': return 'Set up task workload parameters for load balancing';
          case 'iterations': return 'Configure iterations for statistical analysis';
          case 'history': return 'View past algorithm comparison results';
          case 'help': return 'Documentation and keyboard shortcuts';
          default: return 'Set up your load balancing simulation parameters';
        }
      case 'loading': return 'Comparing EACO vs EPSO algorithms';
      case 'animation': return 'Visualizing EACO/EPSO task scheduling process';
      case 'results': return 'Analyze algorithm performance metrics';
      default: return '';
    }
  };

  const getHeaderIcon = () => {
    switch (simulationState) {
      case 'config':
        switch (activeTab) {
          case 'dataCenter': return <Settings size={24} className="text-white" />;
          case 'workload': return <Play size={24} className="text-white" />;
          case 'iterations': return <Repeat size={24} className="text-white" />;
          case 'history': return <BarChart2 size={24} className="text-white" />;
          case 'help': return <HelpCircle size={24} className="text-white" />;
          default: return <Settings size={24} className="text-white" />;
        }
      case 'loading': return <Play size={24} className="text-white animate-pulse" />;
      case 'animation': return <Play size={24} className="text-white" />;
      case 'results': return <BarChart2 size={24} className="text-white" />;
      default: return <Home size={24} className="text-white" />;
    }
  };

  return (
    <header className="bg-[#319694] w-full shadow-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center">
          <button 
            onClick={onBack} 
            className="text-white hover:bg-[#267b79] p-2 rounded-lg mr-4"
            aria-label="Return to home page"
          >
            <Home size={24} />
          </button>
          
          <div className="flex items-center gap-3 flex-grow">
            <div className="bg-white/20 p-2 rounded-lg">
              {getHeaderIcon()}
            </div>
            <div className="flex flex-col">
              <h1 className="text-white text-xl md:text-2xl font-bold">
                {getHeaderTitle()}
              </h1>
              <p className="text-[#c8f0ef] text-xs md:text-sm">
                {getHeaderSubtitle()}
              </p>
            </div>
          </div>
          
          {simulationState !== 'config' && simulationState !== 'loading' && simulationState !== 'animation' && (
            <button
              onClick={onGoToConfig}
              className="text-white hover:bg-[#267b79] px-4 py-2 rounded-lg transition-all flex items-center gap-2"
            >
              <Settings size={18} />
              <span className="hidden md:inline">Return to Configurations</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
