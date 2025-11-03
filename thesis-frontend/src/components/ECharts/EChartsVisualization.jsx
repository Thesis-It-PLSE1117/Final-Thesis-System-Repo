import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { FiInfo, FiDownload } from 'react-icons/fi';
import { Dot, Download, Maximize2 } from 'lucide-react';
import PlotInterpretationCard from '../ResultsTab/PlotInterpretationCard';
import ChartModal from './ChartModal';
import {
  transformPerformanceMetrics,
  transformDetailedAnalysis,
  transformVMUtilization,
  transformEnergyAnalysis,
  transformRadarChart
} from '../../utils/echartsTransformers';

const EChartsVisualization = ({ 
  plotType, 
  plotTitle, 
  algorithm, 
  rawResults,
  interpretation 
}) => {
  const [showInterpretation, setShowInterpretation] = useState(true);
  const [chartError, setChartError] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const chartRef = useRef(null);
  const chartRefsArray = useRef([]);
  const exportMenuRef = useRef(null);

  const getChartOption = () => {
    try {
      if (!rawResults || !rawResults.summary) {
        throw new Error('Missing simulation data');
      }

      const summary = rawResults.summary;
      const algorithmName = algorithm;

      switch (plotType) {
        case 'metrics':
          return transformPerformanceMetrics(summary, algorithmName);
        
        case 'detailed':
          return transformDetailedAnalysis(summary, algorithmName);
        
        case 'vm_utilization':
          if (!rawResults.vmUtilization || rawResults.vmUtilization.length === 0) {
            throw new Error('No VM utilization data available');
          }
          return transformVMUtilization(rawResults.vmUtilization, algorithmName);
        
        case 'energy':
          return transformEnergyAnalysis(summary, algorithmName);
        
        case 'radar':
          return transformRadarChart(summary, algorithmName);
        
        default:
          throw new Error(`Unknown plot type: ${plotType}`);
      }
    } catch (error) {
      setChartError(error.message);
      return null;
    }
  };

  const chartOption = getChartOption();
  const isDetailedAnalysis = plotType === 'detailed';
  const isEnergyAnalysis = plotType === 'energy';
  const hasInterpretation = interpretation && interpretation.summary;

  const handleExportPNG = () => {
    if (isDetailedAnalysis || isEnergyAnalysis) {
      const validRefs = chartRefsArray.current.filter(ref => ref !== null);
      if (validRefs.length === 0) return;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const padding = 20;
      const cols = 2;
      const chartWidth = 600;
      const chartHeight = 300;
      
      canvas.width = (chartWidth * cols) + (padding * (cols + 1));
      canvas.height = (chartHeight * Math.ceil(validRefs.length / cols)) + (padding * (Math.ceil(validRefs.length / cols) + 1));
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const imagePromises = validRefs.map((ref, idx) => {
        return new Promise((resolve) => {
          const instance = ref.getEchartsInstance();
          const url = instance.getDataURL({ type: 'png', pixelRatio: 2, backgroundColor: '#fff' });
          const img = new Image();
          img.onload = () => resolve({ img, idx });
          img.src = url;
        });
      });

      Promise.all(imagePromises).then((images) => {
        images.forEach(({ img, idx }) => {
          const row = Math.floor(idx / cols);
          const col = idx % cols;
          const x = padding + (col * (chartWidth + padding));
          const y = padding + (row * (chartHeight + padding));
          ctx.drawImage(img, x, y, chartWidth, chartHeight);
        });

        const link = document.createElement('a');
        link.download = `${algorithm}_${plotType}_chart.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        setShowExportMenu(false);
      });
    } else {
      if (!chartRef.current) return;
      const echartsInstance = chartRef.current.getEchartsInstance();
      const url = echartsInstance.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#fff'
      });
      const link = document.createElement('a');
      link.download = `${algorithm}_${plotType}_chart.png`;
      link.href = url;
      link.click();
      setShowExportMenu(false);
    }
  };

  const handleExportSVG = () => {
    if (!chartRef.current) return;
    const echartsInstance = chartRef.current.getEchartsInstance();
    const url = echartsInstance.getDataURL({
      type: 'svg',
      backgroundColor: '#fff'
    });
    const link = document.createElement('a');
    link.download = `${algorithm}_${plotType}_chart.svg`;
    link.href = url;
    link.click();
    setShowExportMenu(false);
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (chartError) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">{algorithm}</span>
            <Dot className="text-gray-500" size={16} />
            <span className="text-sm text-gray-600">{plotTitle}</span>
          </div>
        </div>
        <div className="w-full h-64 bg-gray-100 flex flex-col items-center justify-center text-gray-500">
          <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-medium">Chart Error</p>
          <p className="text-sm mt-1 text-gray-400">{chartError}</p>
        </div>
      </div>
    );
  }

  if (!chartOption) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">{algorithm}</span>
            <Dot className="text-gray-500" size={16} />
            <span className="text-sm text-gray-600">{plotTitle}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-sm px-2 py-1 rounded-md transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300"
              title="Expand chart"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <div className="relative" ref={exportMenuRef}>
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="text-sm px-2 py-1 rounded-md transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300"
                title="Export chart"
              >
                <Download className="w-4 h-4" />
              </button>
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                  <button
                    onClick={handleExportPNG}
                    className={`w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                      isDetailedAnalysis || isEnergyAnalysis ? 'rounded-md' : 'rounded-t-md'
                    }`}
                  >
                    Export PNG
                  </button>
                  {!isDetailedAnalysis && !isEnergyAnalysis && (
                    <button
                      onClick={handleExportSVG}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-md"
                    >
                      Export SVG
                    </button>
                  )}
                </div>
              )}
            </div>
            {hasInterpretation && (
              <button
                onClick={() => setShowInterpretation(!showInterpretation)}
                className={`text-sm px-2 py-1 rounded-md transition-colors ${
                  showInterpretation 
                    ? 'bg-[#319694] text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
                title="Toggle interpretation"
              >
                <FiInfo className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div 
        className="p-4 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsModalOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsModalOpen(true);
          }
        }}
        aria-label="Click to expand chart"
      >
        {isDetailedAnalysis ? (
          <div className="grid grid-cols-2 gap-6">
            {chartOption.map((option, idx) => (
              <ReactECharts
                key={idx}
                ref={(el) => { chartRefsArray.current[idx] = el; }}
                option={option}
                style={{ height: '300px', width: '100%' }}
                opts={{ renderer: 'canvas', locale: 'EN' }}
                notMerge={true}
                lazyUpdate={true}
              />
            ))}
          </div>
        ) : isEnergyAnalysis ? (
          <div className="grid grid-cols-2 gap-6">
            {chartOption.map((option, idx) => (
              <ReactECharts
                key={idx}
                ref={(el) => { chartRefsArray.current[idx] = el; }}
                option={option}
                style={{ height: '350px', width: '100%' }}
                opts={{ renderer: 'canvas', locale: 'EN' }}
                notMerge={true}
                lazyUpdate={true}
              />
            ))}
          </div>
        ) : (
          <ReactECharts
            ref={chartRef}
            option={chartOption}
            style={{ 
              height: plotType === 'radar' ? '500px' : plotType === 'vm_utilization' ? '450px' : '400px', 
              width: '100%' 
            }}
            opts={{ renderer: 'canvas', locale: 'EN' }}
            notMerge={true}
            lazyUpdate={true}
          />
        )}
      </div>

      <ChartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        chartOption={chartOption}
        chartTitle={plotTitle}
        algorithm={algorithm}
        isMultiChart={isDetailedAnalysis || isEnergyAnalysis}
      />

      {showInterpretation && hasInterpretation && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <PlotInterpretationCard 
            interpretation={interpretation}
            plotTitle={plotTitle}
          />
        </div>
      )}
    </div>
  );
};

export default EChartsVisualization;
