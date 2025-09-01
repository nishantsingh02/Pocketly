import React from "react";
import { 
  /*ArrowUpRight,*/
  MoreHorizontal,  
  PieChart,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TransactionList } from "@/components/TransactionList";
import SpendingOverview from "@/components/SpendingOverview";
import  SpendingChart  from "@/components/SpendingChart";
import { FinancialSummary } from "@/components/FinancialSummary";
import { MilestoneCards } from "@/components/MilestoneCards";
import  DashboardHeader  from "@/components/DashboardHeader";
import { BudgetGoals } from "@/components/BudgetGoals";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const cardVariants = {
  hover: {
    y: -5,
    boxShadow: "0px 10px 30px -5px rgba(0,0,0,0.3)",
  },
};

const Dashboard: React.FC = () => {
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <motion.div className="mb-8" variants={itemVariants}>
         <DashboardHeader />
        </motion.div>
        
        {/* Financial Summary Cards */}
        <motion.div className="mb-8" variants={itemVariants}>
          <FinancialSummary />
        </motion.div>
        
        {/* Account Cards */}
        <motion.div className="mb-8" variants={itemVariants}>
          <MilestoneCards />
        </motion.div>
        
        {/* Main Dashboard Content */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 px-4 md:px-6 py-6"
          variants={itemVariants}
        >
          {/* Left Column - Spending Analytics */}
          <div className="md:col-span-2 space-y-6">
            <motion.div variants={cardVariants} whileHover="hover">
              <Card className="border-none shadow-xl dark:shadow-slate-900/40 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 gap-4">
                  <div>
                    <CardTitle className="text-lg md:text-xl font-semibold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-700 dark:from-white dark:via-blue-200 dark:to-indigo-300 bg-clip-text text-transparent">
                      PocketGuard Spending Overview
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Your monthly spending patterns
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2 w-full sm:w-auto justify-end">
                    <Button variant="outline" size="sm" className="text-xs">
                      Monthly
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="w-full h-full min-h-[300px]">
                    <SpendingOverview />
                  </div>
                </CardContent>
                <CardFooter className="text-xs sm:text-sm text-muted-foreground pt-0">
                  <div className="flex items-center space-x-1">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
                    <span>5% less than last month</span>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
            
            {/*<Card className="border-none shadow-lg dark:shadow-slate-900/30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-xl font-semibold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    Budget Goals
                  </CardTitle>
                  <CardDescription>
                    Track your monthly budget goals
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <BudgetGoals />
              </CardContent>
            </Card>*/}

            {/* Budget Goals */}
            <BudgetGoals />
            
            {/* Transaction List moved below Budget Goals */}
            <motion.div variants={cardVariants} whileHover="hover">
              <Card className="border-none shadow-xl dark:shadow-slate-900/40 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <CardTitle className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                        Recent Transactions
                      </CardTitle>
                      <CardDescription className="text-sm sm:text-base">
                        View your latest financial activities
                      </CardDescription>
                    </div>
                    <div className="transaction-count text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                      Loading transactions...
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-0">
                    <TransactionList />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
          </div>
          
          {/* Right Column - Pie Chart */}
          <div className="space-y-8">
            {/* New Spending by Category Pie Chart */}
            <motion.div variants={cardVariants} whileHover="hover">
              <Card className="border-none shadow-xl dark:shadow-slate-900/40 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-md font-semibold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent sm:text-xl">
                      Spending by Category
                    </CardTitle>
                    <CardDescription className="text-sm mt-2">
                      How you're spending your money
                    </CardDescription>
                  </div>
                  <PieChart className="h-5 w-5 text-muted-foreground ml-4" />
                </CardHeader>
                <CardContent>
                  <SpendingChart />
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={cardVariants} whileHover="hover">
              <Card className="border-none shadow-xl dark:shadow-slate-900/40 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-semibold">
                    Upcoming Features
                  </CardTitle>
                 {/* <CardDescription className="text-indigo-100">
                    Unlock advanced insights
                  </CardDescription>*/}
                  <CardDescription className="text-indigo-100">
                    Coming Soon !
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <ArrowUpRight className="mr-2 h-4 w-4" />
                      <span>Personalized financial guidance</span>
                    </li>
                    <li className="flex items-center">
                      <ArrowUpRight className="mr-2 h-4 w-4" />
                      <span> Smart budget optimization tips</span>
                    </li>
                    <li className="flex items-center">
                      <ArrowUpRight className="mr-2 h-4 w-4" />
                      <span>Investment strategy suggestions</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <a href="https://x.com/nishantsingh211">
                    <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50">
                      Join the journey
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;