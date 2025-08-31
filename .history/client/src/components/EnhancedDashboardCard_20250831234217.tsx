import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Award, 
  Star, 
  Zap, 
  Shield, 
  DollarSign,
  Calendar,
  BarChart3,
  // PieChart,
  Trophy,
  Crown,
  // Medal,
  // Gift,
  Flame
} from 'lucide-react';
import { Button } from "@/components/ui/button";

interface EnhancedDashboardCardProps {
  type: 'analytics' | 'progress' | 'achievements' | 'insights';
  title: string;
  data?: any;
  theme?: 'default' | 'ocean' | 'sunset' | 'forest' | 'cosmic';
}

const themeConfigs = {
  default: {
    primary: 'from-teal-400 to-cyan-400',
    secondary: 'from-blue-400 to-purple-400',
    accent: 'from-emerald-400 to-teal-400',
    text: 'text-slate-700 dark:text-slate-300',
    bg: 'bg-white dark:bg-slate-800',
    border: 'border-slate-200 dark:border-slate-700'
  },
  ocean: {
    primary: 'from-blue-400 to-cyan-400',
    secondary: 'from-indigo-400 to-blue-400',
    accent: 'from-teal-400 to-emerald-400',
    text: 'text-blue-900 dark:text-blue-100',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800'
  },
  sunset: {
    primary: 'from-orange-400 to-red-400',
    secondary: 'from-pink-400 to-orange-400',
    accent: 'from-yellow-400 to-orange-400',
    text: 'text-orange-900 dark:text-orange-100',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    border: 'border-orange-200 dark:border-orange-800'
  },
  forest: {
    primary: 'from-green-400 to-emerald-400',
    secondary: 'from-teal-400 to-green-400',
    accent: 'from-lime-400 to-green-400',
    text: 'text-green-900 dark:text-green-100',
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800'
  },
  cosmic: {
    primary: 'from-purple-400 to-pink-400',
    secondary: 'from-indigo-400 to-purple-400',
    accent: 'from-violet-400 to-purple-400',
    text: 'text-purple-900 dark:text-purple-100',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-200 dark:border-purple-800'
  }
};

const achievements = [
  { id: 1, name: 'First Expense', icon: DollarSign, color: 'text-green-500', unlocked: true },
  { id: 2, name: 'Budget Master', icon: Target, color: 'text-blue-500', unlocked: true },
  { id: 3, name: 'Saving Streak', icon: Flame, color: 'text-orange-500', unlocked: true },
  { id: 4, name: 'Analytics Pro', icon: BarChart3, color: 'text-purple-500', unlocked: false },
  { id: 5, name: 'Goal Crusher', icon: Trophy, color: 'text-yellow-500', unlocked: false },
  { id: 6, name: 'Financial Guru', icon: Crown, color: 'text-pink-500', unlocked: false }
];

export const EnhancedDashboardCard: React.FC<EnhancedDashboardCardProps> = ({
  type,
  title,
  data,
  theme = 'default'
}) => {
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [isExpanded, setIsExpanded] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  const config = themeConfigs[currentTheme];

  useEffect(() => {
    // Animate progress bar on mount
    const timer = setTimeout(() => {
      setProgressValue(75); // Example progress value
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const renderAnalyticsChart = () => (
    <div className="space-y-4">
      {/* Animated Bar Chart */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Food & Dining</span>
          <span className="font-semibold">₹2,450</span>
        </div>
        <motion.div 
          className="h-3 bg-gray-200 rounded-full overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <motion.div
            className={`h-full bg-gradient-to-r ${config.primary} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: "65%" }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
        </motion.div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Transportation</span>
          <span className="font-semibold">₹1,200</span>
        </div>
        <motion.div 
          className="h-3 bg-gray-200 rounded-full overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <motion.div
            className={`h-full bg-gradient-to-r ${config.secondary} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: "32%" }}
            transition={{ duration: 1.5, delay: 0.7 }}
          />
        </motion.div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Entertainment</span>
          <span className="font-semibold">₹800</span>
        </div>
        <motion.div 
          className="h-3 bg-gray-200 rounded-full overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <motion.div
            className={`h-full bg-gradient-to-r ${config.accent} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: "21%" }}
            transition={{ duration: 1.5, delay: 0.9 }}
          />
        </motion.div>
      </div>
    </div>
  );

  const renderProgressAnimation = () => (
    <div className="space-y-6">
      {/* Main Progress Circle */}
      <div className="flex justify-center">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200 dark:text-gray-700"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className={`text-transparent bg-gradient-to-r ${config.primary} bg-clip-text`}
              strokeDasharray="352"
              strokeDashoffset="352"
              initial={{ strokeDashoffset: 352 }}
              animate={{ strokeDashoffset: 352 - (352 * progressValue) / 100 }}
              transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="text-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <div className={`text-2xl font-bold bg-gradient-to-r ${config.primary} bg-clip-text text-transparent`}>
                {progressValue}%
              </div>
              <div className="text-sm text-gray-500">Complete</div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Progress Details */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Monthly Goal</span>
          <span className="font-semibold">₹15,000</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Spent</span>
          <span className="font-semibold">₹11,250</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Remaining</span>
          <span className="font-semibold text-green-600">₹3,750</span>
        </div>
      </div>
    </div>
  );

  const renderAchievementBadges = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            className={`relative p-3 rounded-xl border-2 transition-all duration-300 ${
              achievement.unlocked 
                ? `${config.border} ${config.bg} shadow-lg` 
                : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
            }`}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ 
              scale: achievement.unlocked ? 1.05 : 1.02,
              y: achievement.unlocked ? -5 : 0
            }}
          >
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-lg ${
                achievement.unlocked 
                  ? `${achievement.color} bg-opacity-20` 
                  : 'text-gray-400 bg-gray-100 dark:bg-gray-700'
              }`}>
                <achievement.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className={`text-sm font-medium ${
                  achievement.unlocked ? config.text : 'text-gray-500'
                }`}>
                  {achievement.name}
                </div>
                <div className="text-xs text-gray-400">
                  {achievement.unlocked ? 'Unlocked' : 'Locked'}
                </div>
              </div>
            </div>
            
            {achievement.unlocked && (
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatDelay: 3 
                }}
              >
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderInsights = () => (
    <div className="space-y-4">
      {/* Spending Trend */}
      <motion.div 
        className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center space-x-3">
          <TrendingUp className="h-6 w-6 text-green-600" />
          <div>
            <div className="font-semibold text-green-800 dark:text-green-200">Great Progress!</div>
            <div className="text-sm text-green-600 dark:text-green-300">
              You're 15% under budget this month
            </div>
          </div>
        </div>
      </motion.div>

      {/* Savings Tip */}
      <motion.div 
        className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center space-x-3">
          <Zap className="h-6 w-6 text-blue-600" />
          <div>
            <div className="font-semibold text-blue-800 dark:text-blue-200">Smart Tip</div>
            <div className="text-sm text-blue-600 dark:text-blue-300">
              Consider setting up automatic transfers to savings
            </div>
          </div>
        </div>
      </motion.div>

      {/* Goal Reminder */}
      <motion.div 
        className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="flex items-center space-x-3">
          <Target className="h-6 w-6 text-purple-600" />
          <div>
            <div className="font-semibold text-purple-800 dark:text-purple-200">Goal Reminder</div>
            <div className="text-sm text-purple-600 dark:text-purple-300">
              You're 3 months away from your vacation goal
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderContent = () => {
    switch (type) {
      case 'analytics':
        return renderAnalyticsChart();
      case 'progress':
        return renderProgressAnimation();
      case 'achievements':
        return renderAchievementBadges();
      case 'insights':
        return renderInsights();
      default:
        return null;
    }
  };

  return (
    <motion.div
      className={`${config.bg} ${config.border} border-2 rounded-2xl shadow-lg overflow-hidden`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      {/* Header */}
      <div className={`p-6 bg-gradient-to-r ${config.primary} text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              {type === 'analytics' && <BarChart3 className="h-6 w-6" />}
              {type === 'progress' && <Target className="h-6 w-6" />}
              {type === 'achievements' && <Award className="h-6 w-6" />}
              {type === 'insights' && <Star className="h-6 w-6" />}
            </motion.div>
            <div>
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="text-white/80 text-sm">Enhanced with animations</p>
            </div>
          </div>
          
          {/* Theme Selector */}
          <div className="flex space-x-1">
            {Object.keys(themeConfigs).map((themeName) => (
              <motion.button
                key={themeName}
                className={`w-6 h-6 rounded-full border-2 border-white/30 ${
                  currentTheme === themeName ? 'border-white' : ''
                }`}
                style={{
                  background: themeName === 'ocean' ? 'linear-gradient(45deg, #60a5fa, #06b6d4)' :
                           themeName === 'sunset' ? 'linear-gradient(45deg, #fb923c, #ef4444)' :
                           themeName === 'forest' ? 'linear-gradient(45deg, #4ade80, #10b981)' :
                           themeName === 'cosmic' ? 'linear-gradient(45deg, #a78bfa, #ec4899)' :
                           'linear-gradient(45deg, #2dd4bf, #06b6d4)'
                }}
                onClick={() => setCurrentTheme(themeName as keyof typeof themeConfigs)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                title={`Switch to ${themeName} theme`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={type}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="mt-6 flex space-x-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              className={`border-2 ${config.border} ${config.text} hover:bg-opacity-10`}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Show Less' : 'Show More'}
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              className={`bg-gradient-to-r ${config.primary} text-white hover:shadow-lg`}
            >
              Take Action
            </Button>
          </motion.div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>This enhanced dashboard card showcases advanced animations, custom themes, and interactive elements to make your financial data more engaging and actionable.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

