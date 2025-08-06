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

// Register ChartJS components
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
          className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
            activeChart === 'bar'
              ? 'bg-[#319694] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <div className="flex items-center">
            <FiBarChart2 className="mr-2" />
            Bar Chart
          </div>
        </button>
        <button
          onClick={() => setActiveChart('line')}
          className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
            activeChart === 'line'
              ? 'bg-[#319694] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <div className="flex items-center">
            <FiTrendingUp className="mr-2" />
            Line Chart
          </div>
        </button>
      </div>
    </div>
  );
};

const PerformanceCharts = ({ rrSummary, epsoSummary, activeChart, setActiveChart }) => {
  const chartData = {
    labels: ['Resource Utilization', 'Response Time', 'Energy Efficiency'],
    datasets: [
      {
        label: 'EACO',
        data: [
          rrSummary.cpuUtilization,
          rrSummary.avgResponseTime,
          rrSummary.energyConsumption
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        label: 'EPSO',
        data: [
          epsoSummary.cpuUtilization,
          epsoSummary.avgResponseTime,
          epsoSummary.energyConsumption
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category', // Explicitly set scale type
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: { 
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            label += context.parsed.y.toFixed(2);
            if (context.dataIndex === 0) label += '%';
            else if (context.dataIndex === 1) label += 's';
            else label += 'Wh';
            return label;
          }
        }
      }
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FiBarChart2 className="text-[#319694]" size={20} />
          Performance Overview
        </h4>
        <ChartSwitcher activeChart={activeChart} setActiveChart={setActiveChart} />
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200" style={{ height: '400px' }}>
        {activeChart === 'bar' ? (
          <Bar 
            data={chartData} 
            options={chartOptions}
            key={activeChart} // Add key to force re-render
          />
        ) : (
          <Line 
            data={chartData} 
            options={chartOptions}
            key={activeChart} // Add key to force re-render
          />
        )}
      </div>
    </div>
  );
};

export default PerformanceCharts;