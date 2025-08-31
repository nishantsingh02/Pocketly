import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Transaction } from '../types';


interface MonthlyData {
  name: string;
  amount: number;
}

export const SpendingOverview: React.FC = () => {
  const [, setTransactions] = useState<Transaction[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const processTransactions = useCallback((transactions: Transaction[]) => {
    // Ensure transactions is an array
    if (!Array.isArray(transactions)) {
      console.error('Expected transactions to be an array, got:', transactions);
      setMonthlyData([]);
      return;
    }

    // Process transactions into monthly totals
    const monthlyTotals = transactions.reduce((acc: { [key: string]: number }, transaction: Transaction) => {
      const date = new Date(transaction.date);
      const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      acc[monthYear] = (acc[monthYear] || 0) + transaction.amount;
      return acc;
    }, {});

    const chartData: MonthlyData[] = Object.entries(monthlyTotals).map(([name, amount]) => ({
      name,
      amount: Number(amount)
    }));

    setMonthlyData(chartData);
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      
      const token = localStorage.getItem('token');
      const response = await axios.get<Transaction[]>(
        `${import.meta.env.VITE_PRODUCTION_BACKEND_URL}/transactions`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setError(null);
      const transactions = Array.isArray(response.data) ? response.data : [];
      setTransactions(transactions);
      processTransactions(transactions);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching transactions:", error);
        setError('Failed to fetch transactions');
      }
    } finally {
      setLoading(false);
    }
  }, [processTransactions]);

  useEffect(() => {
    fetchTransactions();

    const handleTransactionAdded = () => {
      fetchTransactions();
    };

    window.addEventListener('transactionAdded', handleTransactionAdded as EventListener);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      window.removeEventListener('transactionAdded', handleTransactionAdded as EventListener);
    };
  }, [fetchTransactions]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (error) return <div className="h-[300px] flex items-center justify-center text-red-500">{error}</div>;
  if (monthlyData.length === 0) return (
    <div className="h-[300px] flex flex-col items-center justify-center text-center p-6">
      <div className="text-slate-400 dark:text-slate-500 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">No Transactions</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Add your first transaction to see spending patterns</p>
    </div>
  );

  return (
    <div className="p-6 rounded-lg shadow-md">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              fontSize={10}
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
            />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => [`₹ ${value.toLocaleString()}`, 'Amount']}
              labelFormatter={(label) => `Month: ${label}`}
              contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid #ccc',
              borderRadius: '4px',
              textAlign: 'center'
              }}
            />
            <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpendingOverview;




