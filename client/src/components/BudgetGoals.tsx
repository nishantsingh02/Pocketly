import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Transaction } from '../types';

const Backend_url = import.meta.env.VITE_PRODUCTION_BACKEND_URL;

export const BudgetGoals: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [budgetLimit, setBudgetLimit] = useState<number>(0);
  const [isEditing, setIsEditing] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchTransactions = async () => {
    try {
      // Cancel any ongoing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Create new AbortController for this request
      abortControllerRef.current = new AbortController();
      
      const token = localStorage.getItem('token');
      const response = await axios.get<Transaction[]>(`${Backend_url}/transactions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const transactions = Array.isArray(response.data) ? response.data : [];
      setTransactions(transactions);
      setLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching transactions:', error);
        setError('Failed to fetch transactions');
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();

    // Listen for new transaction events
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
  }, []);

  const calculateCategoryTotals = () => {
   
    if (!Array.isArray(transactions)) {
      console.error('Expected transactions to be an array, got:', transactions);
      return {
        categoryTotals: [],
        totalSpent: 0,
        percentageOfBudget: 0
      };
    }

    const categoryTotals = transactions.reduce((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = 0;
      }
      acc[transaction.category] += transaction.amount;
      return acc;
    }, {} as Record<string, number>);

    const totalSpent = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
    const percentageOfBudget = budgetLimit > 0 ? (totalSpent / budgetLimit) * 100 : 0;

    return {
      categoryTotals: Object.entries(categoryTotals).map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / totalSpent) * 100
      })),
      totalSpent,
      percentageOfBudget
    };
  };

  const handleSaveBudget = () => {
    setIsEditing(false);
    localStorage.setItem('budgetLimit', budgetLimit.toString());
  };

  useEffect(() => {
    const savedBudget = localStorage.getItem('budgetLimit');
    if (savedBudget) {
      setBudgetLimit(parseFloat(savedBudget));
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (error) return <div className="h-96 flex items-center justify-center text-red-500">{error}</div>;

  const { categoryTotals, totalSpent, percentageOfBudget } = calculateCategoryTotals();

  return (
    <Card className="border-none shadow-lg dark:shadow-slate-900/30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg">
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2">
  <div className="w-full max-w-full px-2 sm:px-4 md:px-6">
    <CardTitle className="text-lg sm:text-xl md:text-xl font-semibold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
      Budget Overview
    </CardTitle>
    <CardDescription className="text-sm sm:text-base md:text-lg">
      Track your spending against budget
    </CardDescription>
  </div>

  <div className="flex items-center gap-2">
    {isEditing ? (
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
        <div className="space-y-4 w-full sm:w-auto">
          <Label htmlFor="budget">Monthly Budget</Label>
          <Input
            id="budget"
            type="number"
            value={budgetLimit}
            onChange={(e) => setBudgetLimit(parseFloat(e.target.value))}
            className="w-full sm:w-32"
          />
        </div>
        <Button onClick={handleSaveBudget} className="mt-4 sm:mt-8 w-full sm:w-auto">
          Save
        </Button>
      </div>
    ) : (
      <Button variant="outline" onClick={() => setIsEditing(true)} className="w-full sm:w-auto">
        Set Budget
      </Button>
    )}
  </div>
</CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Overall Budget Progress */}
          {budgetLimit > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Budget Progress</span>
                <span className="font-medium">
                  ₹ {totalSpent.toLocaleString()} / ₹ {budgetLimit.toLocaleString()}
                </span>
              </div>
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    percentageOfBudget >= 90 ? 'bg-red-500' :
                    percentageOfBudget >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(percentageOfBudget, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Category Breakdown */}
          <div className="space-y-4">
            {categoryTotals.map(({ category, amount, percentage }) => (
              <div key={category} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 rounded-lg transition-colors">
                <div className="flex justify-between mb-1 text-sm">
                  <span className="font-medium">{category}</span>
                  <span className="font-medium">
                    ₹ {amount.toLocaleString()} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-violet-500 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 