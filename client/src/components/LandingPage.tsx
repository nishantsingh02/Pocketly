import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Shield, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Smartphone, 
  Zap,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const // cast to const so TS allows it
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const
    }
  },
  hover: {
    scale: 1.05,
    y: -10,
    transition: {
      duration: 0.3,
      ease: "easeInOut" as const
    }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};


  const handleGetStarted = () => {
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                PocketGuard
              </span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-7xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6"
            variants={itemVariants}
          >
            <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-700 dark:from-white dark:via-blue-200 dark:to-indigo-300 bg-clip-text text-transparent">
              Smart Finance
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Management
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Take control of your financial future with PocketGuard. Track expenses, set goals, and achieve financial freedom with our intelligent personal finance platform.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={itemVariants}
          >
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-lg px-8 py-4 h-auto"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4 h-auto border-2 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Watch Demo
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-slate-800/50">
        <motion.div 
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Why Choose PocketGuard?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Built with modern technology and user experience in mind, PocketGuard provides everything you need for comprehensive financial management.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Your financial data is protected with enterprise-grade security and privacy controls."
              },
              {
                icon: TrendingUp,
                title: "Smart Analytics",
                description: "Get insights into your spending patterns with AI-powered financial analysis."
              },
              {
                icon: Target,
                title: "Goal Tracking",
                description: "Set financial milestones and track your progress toward achieving them."
              },
              {
                icon: BarChart3,
                title: "Visual Reports",
                description: "Beautiful charts and graphs to understand your financial health at a glance."
              },
              {
                icon: Smartphone,
                title: "Mobile First",
                description: "Responsive design that works perfectly on all devices and screen sizes."
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Built with modern technologies for instant loading and smooth performance."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="h-16 w-16 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <motion.div 
          className="max-w-4xl mx-auto text-center text-white"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl font-bold mb-6"
            variants={itemVariants}
          >
            Ready to Transform Your Financial Life?
          </motion.h2>
          
          <motion.p 
            className="text-xl mb-8 text-indigo-100"
            variants={itemVariants}
          >
            Start your journey to financial freedom with PocketGuard today.
          </motion.p>
          
          <motion.div variants={itemVariants}>
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-white text-indigo-600 hover:bg-indigo-50 text-lg px-8 py-4 h-auto"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">PocketGuard</span>
            </div>
            
            <div className="text-center md:text-right">
              <div className="text-slate-400 text-sm mb-2">
                © 2025 PocketGuard. All rights reserved.
              </div>
              <div className="text-slate-500 text-xs">
                Developed with ❤️ by{" "}
                <a 
                  href="https://twitter.com/nishantsingh211" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                >
                  Nishant Singh
                </a>
                {" "}•{" "}
                <a 
                  href="https://twitter.com/nishantsingh211" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  @nishantsingh211
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
