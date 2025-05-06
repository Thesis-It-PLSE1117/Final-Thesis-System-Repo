import { Bar, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { FiBarChart2, FiTrendingUp } from 'react-icons/fi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const ChartSwitcher = ({ activeChart, setActiveChart }) => {
  return (
    <div className="flex justify-end mb-4">
      <div className="inline-flex rounded-md shadow-sm">
        <button
          onClick={() => setActiveChart('bar')}
          className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors ${
            activeChart === 'bar'
              ? 'bg-[#319694] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <div className="flex items-center">
            <FiBarChart2 className="mr-2" />
            Bar View
          </div>
        </button>
        <button
          onClick={() => setActiveChart('line')}
          className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors ${
            activeChart === 'line'
              ? 'bg-[#319694] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <div className="flex items-center">
            <FiTrendingUp className="mr-2" />
            Line View
          </div>
        </button>
      </div>
    </div>
  );
};

const MetricChart = ({ title, eacoValue, epsoValue, unit, activeChart }) => {
  const chartData = {
    labels: ['Enhanced ACO', 'EPSO'],
    datasets: [{
      data: [eacoValue, epsoValue],
      backgroundColor: [
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 99, 132, 0.7)'
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)'
      ],
      borderWidth: 1,
      borderRadius: 6,
      borderSkipped: false,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: title,
        font: { size: 14, weight: '600' },
        padding: { bottom: 10 }
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label || ''}: ${context.parsed.y.toFixed(2)}${unit}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { drawBorder: false },
        ticks: { padding: 5 }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 h-[280px]">
      {activeChart === 'bar' ? (
        <Bar 
          data={chartData} 
          options={{
            ...chartOptions,
            plugins: {
              ...chartOptions.plugins,
              tooltip: {
                callbacks: {
                  label: (context) => `${context.label}: ${context.parsed.y.toFixed(2)}${unit}`
                }
              }
            }
          }} 
        />
      ) : (
        <Line 
          data={chartData} 
          options={{
            ...chartOptions,
            elements: {
              point: {
                radius: 5,
                hoverRadius: 7
              }
            }
          }} 
        />
      )}
    </div>
  );
};

const PerformanceCharts = ({ eacoSummary, epsoSummary, activeChart, setActiveChart }) => {
  const metrics = [
    { title: 'Resource Utilization', value: 'cpuUtilization', unit: '%' },
    { title: 'Response Time', value: 'avgResponseTime', unit: 's' },
    { title: 'Energy Consumption', value: 'energyConsumption', unit: 'Wh' },
    { title: 'Load Imbalance', value: 'loadImbalance', unit: '%' },
    { title: 'Makespan', value: 'makespan', unit: 's' }
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-semibold text-gray-700 text-lg">Performance Metrics</h4>
        <ChartSwitcher activeChart={activeChart} setActiveChart={setActiveChart} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {metrics.map((metric, index) => (
          <MetricChart
            key={index}
            title={metric.title}
            eacoValue={eacoSummary[metric.value]}
            epsoValue={epsoSummary[metric.value]}
            unit={metric.unit}
            activeChart={activeChart}
          />
        ))}
      </div>
    </div>
  );
};

export default PerformanceCharts;