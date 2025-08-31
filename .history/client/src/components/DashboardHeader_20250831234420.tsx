import { useState } from "react";
import { Menu, X, User, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateContentModel } from "./CreateContentModel";
import { useAuth } from "../contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import logo from "../assets/logo.svg";
import { motion, cubicBezier } from "framer-motion";

export default function DashboardHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const { isAuthenticated, user, logout } = useAuth();
  const { }
  const easeIn = cubicBezier(0.42, 0, 1, 1);
  const easeOut = cubicBezier(0.25, 1, 0.5, 1);
  const easeInOut = cubicBezier(0.42, 0, 0.58, 1);

  const buttonVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: { 
      scale: 1.05, 
      rotate: [0, -2, 2, 0],
      transition: { 
        duration: 0.3,
        rotate: { duration: 0.6, repeat: Infinity, repeatType: "reverse" }
      }
    },
    tap: { scale: 0.95 }
  };

  const iconVariants = {
    initial: { rotate: 0, scale: 1 },
    hover: { 
      rotate: 180, 
      scale: 1.2,
      transition: { duration: 0.4, ease: easeInOut }
    }
  };

  const navVariants = {
    initial: { y: -20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: easeOut }
    }
  };

  const backlightVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: [0, 0.8, 0],
      scale: [0.8, 1.2, 0.8],
      transition: { 
        duration: 3, 
        repeat: Infinity, 
        ease: easeInOut
      }
    }
  };

  return (
    <>
      <motion.header 
        className="sticky top-0 z-50 w-full py-4"
        variants={navVariants}
        initial="initial"
        animate="animate"
      >
        {/* Backlit capsule container */}
        <div className="relative mx-6">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-teal-400/20 via-cyan-400/20 to-blue-400/20 rounded-full blur-xl"
            variants={backlightVariants}
            initial="initial"
            animate="animate"
          />
          
          {/* Main capsule navigation */}
          <div className="relative bg-white/90 dark:bg-slate-50/90 backdrop-blur-xl rounded-full border border-slate-200/50 dark:border-slate-300/50 shadow-lg">
            <div className="flex items-center justify-between px-8 py-4">
              {/* Logo Section */}
              <div className="flex items-center">
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <img src={logo} className="w-40 h-12 object-contain" alt="PocketGuard" />
                </motion.div>
              </div>

              {/* Center Welcome Message */}
              <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2">
                {isAuthenticated && (
                  <motion.div 
                    className="text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <h1 className="text-lg font-semibold text-slate-600 dark:text-slate-700">
                      Welcome to <span className="text-teal-600 dark:text-teal-500">PocketGuard</span>
                    </h1>
                  </motion.div>
                )}
              </div>

              {/* Right Navigation */}
              <div className="hidden md:flex items-center space-x-4">
                <motion.div
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  className="relative"
                >
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    size="sm"
                    className="relative overflow-hidden bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 hover:from-teal-500 hover:via-cyan-500 hover:to-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-2.5 rounded-full border-0 font-semibold text-sm"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                    <motion.div
                      variants={iconVariants}
                      className="relative z-10 mr-2"
                    >
                      <Plus className="h-4 w-4" />
                    </motion.div>
                    <span className="relative z-10">Add Expense</span>
                    <motion.div
                      className="absolute -top-1 -right-1"
                      initial={{ scale: 0, rotate: 0 }}
                      whileHover={{ scale: 1, rotate: 360 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <Sparkles className="h-3 w-3 text-cyan-200" />
                    </motion.div>
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <ThemeToggle />
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-200 dark:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-100 transition-colors duration-200 text-slate-600 dark:text-slate-700 rounded-full px-4 py-2"
                    onClick={isAuthenticated ? logout : () => window.location.href = '/signin'}
                  >
                    <User className="mr-2 h-4 w-4" />
                    {isAuthenticated ? "Logout" : "Sign In"}
                  </Button>
                </motion.div>
              </div>

              {/* Mobile Menu Button */}
              <div className="flex md:hidden items-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-10 w-10 flex items-center justify-center text-slate-600 dark:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-200"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    {isMenuOpen ? (
                      <X className="h-5 w-5" />
                    ) : (
                      <Menu className="h-5 w-5" />
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Welcome Message */}
      <div className="md:hidden bg-transparent py-2 px-6 text-center">
        {isAuthenticated && !isMenuOpen && (
          <motion.h2 
            className="text-base font-medium text-slate-600 dark:text-slate-700"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Welcome to <span className="text-teal-600 dark:text-teal-500">PocketGuard</span>
          </motion.h2>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <motion.div 
          className="md:hidden fixed z-40 inset-x-0 top-32"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mx-6 rounded-2xl bg-white/95 dark:bg-slate-50/95 shadow-xl py-4 px-3 backdrop-blur-xl border border-slate-200/50 dark:border-slate-300/50">
            {isAuthenticated && (
              <div className="px-4 py-3 mb-3 text-center border-b border-slate-100 dark:border-slate-200">
                <h2 className="text-base font-medium text-slate-600 dark:text-slate-700">
                  Welcome to <span className="text-teal-600 dark:text-teal-500">PocketGuard</span>
                </h2>
              </div>
            )}
            
            <div className="space-y-2">
              <motion.div
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-between text-left font-medium text-slate-600 dark:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-100 transition-colors duration-200 rounded-xl py-3"
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                >
                  <span className="text-sm">Add Expense</span>
                  <motion.div
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Plus className="mr-3 h-4 w-4" />
                  </motion.div>
                </Button>
              </motion.div>
              
              <div className="px-4 py-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-200">
                <span className="text-sm text-slate-500 dark:text-slate-600">Toggle Theme</span>
                <ThemeToggle />
              </div>
              
              <motion.div
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left font-medium text-slate-600 dark:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-100 transition-colors duration-200 rounded-xl"
                  onClick={isAuthenticated ? logout : () => window.location.href = '/signin'}
                >
                  <User className="mr-2 h-4 w-4" />
                  {isAuthenticated ? "Logout" : "Sign In"}
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {isModalOpen && (
        <CreateContentModel
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}