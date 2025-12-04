import { useMemo } from 'react';
import { useSalesRecords } from '../hooks/useDatabase';
import { TrendingUp, Users, DollarSign, PieChart as PieChartIcon } from 'lucide-react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const { records } = useSalesRecords();

  const analytics = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const todayRecords = records.filter(r => r.date === today);
    const weekRecords = records.filter(r => r.date >= weekAgo);
    const monthRecords = records.filter(r => r.date >= monthAgo);

    const todaySales = todayRecords.reduce((sum, r) => sum + r.totalAmount, 0);
    const weekSales = weekRecords.reduce((sum, r) => sum + r.totalAmount, 0);
    const monthSales = monthRecords.reduce((sum, r) => sum + r.totalAmount, 0);

    const uniqueClients = new Set(records.map(r => r.clientName)).size;

    const salesByMachine: Record<string, number> = {};
    records.forEach(record => {
      salesByMachine[record.machineType] = (salesByMachine[record.machineType] || 0) + record.totalAmount;
    });

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      return date.toISOString().split('T')[0];
    }).reverse();

    const dailySales = last7Days.map(date => {
      return records
        .filter(r => r.date === date)
        .reduce((sum, r) => sum + r.totalAmount, 0);
    });

    const monthlyData: Record<string, number> = {};
    records.forEach(record => {
      const month = record.date.substring(0, 7);
      monthlyData[month] = (monthlyData[month] || 0) + record.totalAmount;
    });

    return {
      todaySales,
      weekSales,
      monthSales,
      uniqueClients,
      salesByMachine,
      last7Days,
      dailySales,
      monthlyData
    };
  }, [records]);

  const machineChartData = {
    labels: Object.keys(analytics.salesByMachine),
    datasets: [
      {
        data: Object.values(analytics.salesByMachine),
        backgroundColor: [
          '#f97316',
          '#fb923c',
          '#fdba74',
          '#fed7aa',
          '#ffedd5',
          '#fff7ed'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const weeklyChartData = {
    labels: analytics.last7Days.map(date => {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Daily Sales',
        data: analytics.dailySales,
        backgroundColor: 'rgba(249, 115, 22, 0.5)',
        borderColor: 'rgb(249, 115, 22)',
        borderWidth: 2,
        tension: 0.4
      }
    ]
  };

  const monthlyChartData = {
    labels: Object.keys(analytics.monthlyData).sort(),
    datasets: [
      {
        label: 'Monthly Sales',
        data: Object.keys(analytics.monthlyData)
          .sort()
          .map(month => analytics.monthlyData[month]),
        backgroundColor: 'rgba(249, 115, 22, 0.7)',
        borderColor: 'rgb(249, 115, 22)',
        borderWidth: 2
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium opacity-90">Today</span>
          </div>
          <p className="text-3xl font-bold">${analytics.todaySales.toFixed(2)}</p>
          <p className="text-sm opacity-90 mt-1">Total Sales</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium opacity-90">This Week</span>
          </div>
          <p className="text-3xl font-bold">${analytics.weekSales.toFixed(2)}</p>
          <p className="text-sm opacity-90 mt-1">Weekly Sales</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium opacity-90">This Month</span>
          </div>
          <p className="text-3xl font-bold">${analytics.monthSales.toFixed(2)}</p>
          <p className="text-sm opacity-90 mt-1">Monthly Sales</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium opacity-90">All Time</span>
          </div>
          <p className="text-3xl font-bold">{analytics.uniqueClients}</p>
          <p className="text-sm opacity-90 mt-1">Total Clients</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-bold text-gray-800">Sales by Machine Type</h3>
          </div>
          {Object.keys(analytics.salesByMachine).length > 0 ? (
            <div className="h-64 flex items-center justify-center">
              <Pie
                data={machineChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
              />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No data available
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-bold text-gray-800">Last 7 Days Sales Trend</h3>
          </div>
          <div className="h-64">
            <Line
              data={weeklyChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `$${value}`
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-bold text-gray-800">Monthly Sales Trend</h3>
        </div>
        {Object.keys(analytics.monthlyData).length > 0 ? (
          <div className="h-64">
            <Bar
              data={monthlyChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `$${value}`
                    }
                  }
                }
              }}
            />
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            No data available
          </div>
        )}
      </div>
    </div>
  );
}
