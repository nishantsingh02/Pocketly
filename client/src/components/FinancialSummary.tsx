import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, DollarSign, PiggyBank, Wallet, Edit } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog";
import api from "@/utils/axios";
import { motion } from "framer-motion";

interface Transaction {
  id: number;
  name: string;
  category: string;
  date: string;
  amount: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const FinancialSummary: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [initialBalance, setInitialBalance] = useState<number>(0);
  const [balanceInput, setBalanceInput] = useState<string>("");
  const [isBalanceDialogOpen, setIsBalanceDialogOpen] = useState<boolean>(false);
  
  // Load initial balance from localStorage on component mount
  useEffect(() => {
    const savedBalance = localStorage.getItem('initialBalance');
    if (savedBalance) {
      setInitialBalance(parseFloat(savedBalance));
    }
  }, []);

  // Fetch transactions from the API
  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api.get('/transactions');
      // Ensure we're getting an array
      const fetchedTransactions = Array.isArray(response.data) ? response.data : [];
      
      setTransactions(fetchedTransactions);
      
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to fetch transactions. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Set up polling to check for new transactions
  useEffect(() => {
    // Initial fetch
    fetchTransactions();
    
    // Set up polling to check for new transactions
    const pollingInterval = import.meta.env.VITE_POLLING_INTERVAL || 30000;
    const intervalId = setInterval(fetchTransactions, parseInt(pollingInterval.toString()));
    
    // Cleanup function
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchTransactions]);

  // Calculate total spending with safety check
  const totalSpending = Array.isArray(transactions) 
    ? transactions.reduce((acc, transaction) => acc + transaction.amount, 0)
    : 0;
  
  // Calculate current balance (initial balance - total spending)
  // Ensure balance doesn't go below 0
  const currentBalance = Math.max(0, initialBalance - totalSpending);
  
  // Calculate spending percentage of initial balance
  const spendingPercentage = initialBalance > 0 ? (totalSpending / initialBalance) * 100 : 0;

  // Handle balance submission
  const handleBalanceSubmit = () => {
    const newBalance = parseFloat(balanceInput);
    if (!isNaN(newBalance) && newBalance >= 0) {
      setInitialBalance(newBalance);
      localStorage.setItem('initialBalance', newBalance.toString());
      setIsBalanceDialogOpen(false);
      setBalanceInput("");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      {/* Financial Summary Header */}
      <motion.div className="mb-6" variants={cardVariants}>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-700 dark:from-white dark:via-blue-200 dark:to-indigo-300 bg-clip-text text-transparent">
          PocketGuard Financial Overview
        </h2>
        <p className="text-sm text-muted-foreground">
          Your comprehensive financial summary at a glance
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card className="border-none shadow-lg dark:shadow-slate-900/30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-semibold">Total Balance</CardTitle>
                <CardDescription>Your current available funds</CardDescription>
              </div>
              <Dialog open={isBalanceDialogOpen} onOpenChange={setIsBalanceDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full">
                    <Edit className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Set Initial Balance</DialogTitle>
                    <DialogDescription>
                      Enter your starting balance amount. This will be used to calculate your current balance after transactions.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="balance" className="text-right">
                        Balance
                      </label>
                      <Input
                        id="balance"
                        type="number"
                        placeholder="Enter amount"
                        className="col-span-3"
                        value={balanceInput}
                        onChange={(e) => setBalanceInput(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleBalanceSubmit}>Save Balance</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mr-3">
                  <Wallet className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                     ₹ {currentBalance.toLocaleString()}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Initial: ₹ {initialBalance.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className={`flex items-center px-2.5 py-1 rounded-full text-sm ${
                currentBalance < initialBalance * 0.3 ? 'text-rose-500 bg-rose-50 dark:bg-rose-900/20' : 
                currentBalance < initialBalance * 0.6 ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' : 
                'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
              }`}>
                {currentBalance < initialBalance ? <ArrowDownRight className="h-4 w-4 mr-1" /> : <ArrowUpRight className="h-4 w-4 mr-1" />}
                <span>{initialBalance === 0 ? '0.0' : ((currentBalance / initialBalance) * 100).toFixed(1)}%</span>
              </div>
            </div>
            <div className="w-full h-1 bg-slate-100 dark:bg-slate-700 rounded-full mt-2">
              <div 
                className={`h-full rounded-full ${
                  currentBalance < initialBalance * 0.3 ? 'bg-gradient-to-r from-rose-500 to-red-600' : 
                  currentBalance < initialBalance * 0.6 ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 
                  'bg-gradient-to-r from-indigo-500 to-purple-600'
                }`}
                style={{ width: `${(currentBalance / initialBalance) * 100}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-lg dark:shadow-slate-900/30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Monthly Spending</CardTitle>
            <CardDescription>Your expenses this month</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center mr-3">
                  <DollarSign className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    ₹ {totalSpending.toLocaleString()}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {transactions.length} {transactions.length === 1 ? 'transaction' : 'transactions'}
                  </p>
                </div>
              </div>
              <div className={`flex items-center px-2.5 py-1 rounded-full text-sm ${
                spendingPercentage > 70 ? 'text-rose-500 bg-rose-50 dark:bg-rose-900/20' : 
                spendingPercentage > 40 ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' : 
                'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
              }`}>
                <ArrowDownRight className="h-4 w-4 mr-1" />
                <span>{spendingPercentage.toFixed(1)}% of balance</span>
              </div>
            </div>
            <div className="w-full h-1 bg-slate-100 dark:bg-slate-700 rounded-full mt-2">
              <div 
                className={`h-full rounded-full ${
                  spendingPercentage > 70 ? 'bg-gradient-to-r from-rose-500 to-red-600' : 
                  spendingPercentage > 40 ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 
                  'bg-gradient-to-r from-amber-500 to-orange-600'
                }`}
                style={{ width: `${Math.min(spendingPercentage, 100)}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-lg dark:shadow-slate-900/30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Savings Goal</CardTitle>
            <CardDescription>Progress toward your target</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mr-3">
                  <PiggyBank className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    ₹ {(currentBalance * 0.2).toLocaleString()}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    20% of current balance
                  </p>
                </div>
              </div>
              <div className="flex items-center text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full text-sm">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>5.2%</span>
              </div>
            </div>
            <div className="w-full h-1 bg-slate-100 dark:bg-slate-700 rounded-full mt-2">
              <div className="h-full w-[35%] rounded-full bg-gradient-to-r from-emerald-500 to-teal-600"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};




