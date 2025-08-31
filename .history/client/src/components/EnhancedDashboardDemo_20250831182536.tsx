import React from 'react';
import { motion, cube  } from 'framer-motion';
import { EnhancedDashboardCard } from './EnhancedDashboardCard';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Palette, BarChart3, Target, Award, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EnhancedDashboardDemo: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Header */}
      <motion.header 
        className="sticky top-0 z-50 w-full py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </Button>
              </motion.div>
              
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-800 dark:text-slate-200">
                  Enhanced Dashboard Demo
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
              <Palette className="h-4 w-4" />
              <span>Interactive Themes</span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main 
        className="max-w-7xl mx-auto px-6 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Introduction Section */}
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Enhanced Dashboard Cards
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Experience the power of animated charts, progress animations, custom themes, and achievement badges. 
            Each card is fully interactive and showcases advanced UI/UX techniques.
          </motion.p>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          variants={itemVariants}
        >
          {[
            { icon: BarChart3, title: "Animated Charts", description: "Smooth data visualization with staggered animations" },
            { icon: Target, title: "Progress Tracking", description: "Interactive circular progress with smooth transitions" },
            { icon: Award, title: "Achievement Badges", description: "Gamified experience with unlockable rewards" },
            { icon: Palette, title: "Custom Themes", description: "5 beautiful color schemes to choose from" }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700 text-center"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="h-16 w-16 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Analytics Card */}
          <motion.div variants={itemVariants}>
            <EnhancedDashboardCard
              type="analytics"
              title="Spending Analytics"
              theme="ocean"
            />
          </motion.div>

          {/* Progress Card */}
          <motion.div variants={itemVariants}>
            <EnhancedDashboardCard
              type="progress"
              title="Budget Progress"
              theme="sunset"
            />
          </motion.div>

          {/* Achievements Card */}
          <motion.div variants={itemVariants}>
            <EnhancedDashboardCard
              type="achievements"
              title="Achievements & Badges"
              theme="forest"
            />
          </motion.div>

          {/* Insights Card */}
          <motion.div variants={itemVariants}>
            <EnhancedDashboardCard
              type="insights"
              title="Smart Insights"
              theme="cosmic"
            />
          </motion.div>
        </div>

        {/* Interactive Demo Section */}
        <motion.div 
          className="mt-16 text-center"
          variants={itemVariants}
        >
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
            <motion.div
              className="h-16 w-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mx-auto mb-6"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <Lightbulb className="h-8 w-8 text-white" />
            </motion.div>
            
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
              Try It Out!
            </h3>
            
            <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
              Click on the theme selector dots in each card header to switch between different color schemes. 
              Each theme completely transforms the visual appearance while maintaining the same functionality.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              {['default', 'ocean', 'sunset', 'forest', 'cosmic'].map((theme) => (
                <motion.div
                  key={theme}
                  className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium capitalize"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {theme} Theme
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="mt-16 text-center"
          variants={itemVariants}
        >
          <motion.div
            className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-2xl p-8 text-white"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-2xl font-bold mb-4">
              Ready to Enhance Your Dashboard?
            </h3>
            
            <p className="text-teal-100 mb-6 max-w-2xl mx-auto">
              These enhanced cards can be easily integrated into your existing PocketGuard dashboard. 
              They provide engaging visual feedback and make financial data more accessible and fun to interact with.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-white text-teal-600 hover:bg-teal-50 px-8 py-3"
                  onClick={() => navigate('/dashboard')}
                >
                  View Dashboard
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/20 px-8 py-3"
                >
                  Learn More
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.main>
    </div>
  );
};

