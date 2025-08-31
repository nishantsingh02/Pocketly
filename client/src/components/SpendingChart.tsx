import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, TooltipItem } from 'chart.js';

const Backend_url = import.meta.env.VITE_PRODUCTION_BACKEND_URL;
ChartJS.register(ArcElement, Tooltip, Legend);

interface Transaction {
  id: string;
  category: string;
  amount: number;
  date: string;
}

const SpendingChart: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hiddenCategories, setHiddenCategories] = useState<string[]>([]);

  const fetchTransactions = async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`${Backend_url}/transactions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // Ensure we're setting an array
      const transactions = Array.isArray(response.data) ? response.data : [];
      setTransactions(transactions);
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(`Failed to fetch transactions: ${errorMessage}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();

    // Listen for new transaction events
    const handleTransactionAdded = () => {
      fetchTransactions(); // Fetch all transactions to ensure data consistency
    };

    window.addEventListener('transactionAdded', handleTransactionAdded as EventListener);

    return () => {
      window.removeEventListener('transactionAdded', handleTransactionAdded as EventListener);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (error) return <div className="h-96 flex items-center justify-center text-red-500">{error}</div>;
  if (!transactions.length) return (
    <div className="h-96 flex flex-col items-center justify-center text-center p-6">
      <div className="text-slate-400 dark:text-slate-500 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">No Transactions</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Add your first transaction to see spending by category</p>
    </div>
  );

  const categoryColors: Record<string, string> = {
    Food: "#FF6384",
    Transport: "#36A2EB",
    Entertainment: "#FFCE56",
    Bills: "#4BC0C0",
    Other: "#9966FF",
    Shopping: "#FF9F40",
    Healthcare: "#4BC0C0",
    Education: "#FF6384",
  };

  const getCategoryColor = (category: string) => {
    if (categoryColors[category]) return categoryColors[category];
    // Generates a random color for unknown categories
    const colors = Object.values(categoryColors);
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const allCategories = transactions.reduce((acc, transaction) => {
    if (!acc[transaction.category]) {
      acc[transaction.category] = 0;
    }
    acc[transaction.category] += transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  // Calculate grand total for all categories
  const grandTotal = Object.values(allCategories).reduce((a, b) => a + b, 0);

  const visibleCategories = Object.entries(allCategories)
    .filter(([category]) => !hiddenCategories.includes(category))
    .reduce((acc, [category, amount]) => {
      acc[category] = amount;
      return acc;
    }, {} as Record<string, number>);


  const visibleTotal = Object.values(visibleCategories).reduce((a, b) => a + b, 0);

  const chartData = {
    labels: Object.keys(visibleCategories),
    datasets: [{
      data: Object.values(visibleCategories),
      backgroundColor: Object.keys(visibleCategories).map(category => getCategoryColor(category)),
    }],
  };

  const toggleCategory = (category: string) => {
    setHiddenCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="flex flex-col h-full min-h-[700px] p-6">
      {/* Chart Section */}
      <div className="relative h-[160px] w-full flex items-center justify-center mb-6">
        <Pie
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                padding: 12,
                titleFont: {
                  size: 14,
                  weight: 'bold'
                },
                bodyFont: {
                  size: 13
                },
                callbacks: {
                  label: function(context: TooltipItem<'pie'>) {
                    const value = context.raw as number;
                    const percentage = ((value / visibleTotal) * 100).toFixed(1);
                    return ` $${value.toLocaleString()} (${percentage}%)`;
                  }
                }
              }
            },
          }}
        />
      </div>

      <div className="space-y-4 w-full max-w-full px-2 sm:px-4">
  {Object.entries(allCategories).map(([category, amount]) => {
    const isHidden = hiddenCategories.includes(category);
    const color = getCategoryColor(category);
    const percentage = ((amount / grandTotal) * 100).toFixed(1);

    return (
      <div 
        key={category}
        onClick={() => toggleCategory(category)}
        className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-200
          ${isHidden ? 'opacity-50 bg-gray-50/50' : 'hover:bg-gray-100/80 dark:hover:bg-gray-800/80'}
          border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md w-full gap-2 sm:gap-4`}
      >
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Dot */}
          <div 
            className="w-4 h-4 rounded-full flex-shrink-0"
            style={{ backgroundColor: color }}
          />

          {/* Text Info */}
          <div className="flex flex-col w-full sm:w-auto">
            <span className={`text-sm sm:text-base font-medium text-gray-800 dark:text-gray-100 break-words
              ${isHidden ? 'line-through decoration-gray-400' : ''}`}>
              {category}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {percentage}%
            </span>
          </div>
        </div>

        {/* Right: Amount */}
        <div className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200 text-right w-full sm:w-auto">
          <span className={`${isHidden ? 'line-through decoration-gray-400' : ''}`}>
            ₹ {amount.toLocaleString()}
          </span>
        </div>
      </div>
    );
  })}
</div>
</div>

  );
};

export default SpendingChart;