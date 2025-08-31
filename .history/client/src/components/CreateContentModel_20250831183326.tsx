import { useRef, useState } from 'react';
import { CrossIcon } from "./Icons/CrossIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from 'axios';
import Calender from "./Calender";
import { useAuth } from "../contexts/AuthContext";
import { Transaction } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, DollarSign, Calendar, Tag, Sparkles } from 'lucide-react';

const Backend_url = import.meta.env.VITE_PRODUCTION_BACKEND_URL;

interface CreateContentModelProps {
  open: boolean;
  onClose: () => void;
}

export function CreateContentModel({ open, onClose }: CreateContentModelProps) {
  const { token } = useAuth();
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);


const easeIn = cubicBezier(0.42, 0, 1, 1);
const easeOut = cubicBezier(0.25, 1, 0.5, 1);
const easeInOut = cubicBezier(0.42, 0, 0.58, 1);

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50,
      rotateX: -15
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.4,
        ease: easeOut,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50,
      rotateX: -15,
      transition: { duration: 0.3 }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const inputVariants = {
    focus: { 
      scale: 1.02, 
      boxShadow: "0 0 0 3px rgba(20, 184, 166, 0.1)",
      transition: { duration: 0.2 }
    }
  };

  const addContent = async () => {
    if (isSubmitting) return;
    const name = titleRef.current?.value;
    const amount = linkRef.current?.value;
    const date = selectedDate;
    const category = selectedCategory;

    if (!name || !/^[A-Za-z\s]+$/.test(name)) {
      setError('Expense Name must contain only letters');
      return;
    }

    if (!name || !amount || !category || !date) {
      setError("All fields are required");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(date);
    selected.setHours(0, 0, 0, 0);

    if (selected > today) {
      setError("Date cannot be in the future");
      return;
    }

    try {
      setIsSubmitting(true);
      const formattedDate = date.toISOString().split('T')[0];
      
      const response = await axios.post<Transaction>(`${Backend_url}/transactions`, {
        name,
        amount: parseFloat(amount),
        date: formattedDate,
        category: selectedCategory,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 201) {
        const newTransaction = {
          id: response.data.id,
          description: name,
          category: selectedCategory,
          date: formattedDate,
          amount: parseFloat(amount)
        };
        
        const event = new CustomEvent('transactionAdded', {
          detail: newTransaction
        });
        window.dispatchEvent(event);

        setError(null);
        onClose();
        titleRef.current!.value = "";
        linkRef.current!.value = "";
        setSelectedDate(null);
        setSelectedCategory("");
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : "Failed to create expense. Please try again.";
      setError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50">
        {/* Backdrop */}
        <motion.div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div 
              className="relative w-full max-w-lg"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <motion.div 
                className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 p-6 text-white"
                variants={itemVariants}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Plus className="h-5 w-5" />
                    </motion.div>
                    <div>
                      <h2 className="text-2xl font-bold">Add New Expense</h2>
                      <p className="text-teal-100 text-sm">Track your spending with style</p>
                    </div>
                  </div>
                  <motion.button 
                    onClick={onClose}
                    className="rounded-full p-2 hover:bg-white/20 transition-colors"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <CrossIcon />
                  </motion.button>
                </div>
                
                {/* Floating sparkles */}
                <motion.div
                  className="absolute top-4 right-20"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 180, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <Sparkles className="h-4 w-4 text-cyan-200" />
                </motion.div>
              </motion.div>

              {/* Content */}
              <div className="bg-white dark:bg-gray-800 p-6 space-y-6 rounded-b-2xl shadow-2xl">
                {/* Name Input */}
                <motion.div className="space-y-3" variants={itemVariants}>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Tag className="h-4 w-4 text-teal-500" />
                    <span>Expense Name</span>
                  </label>
                  <motion.div
                    variants={inputVariants}
                    whileFocus="focus"
                  >
                    <Input
                      ref={titleRef}
                      placeholder="Enter expense name"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-all duration-200" 
                    />
                  </motion.div>
                </motion.div>

                {/* Amount Input */}
                <motion.div className="space-y-3" variants={itemVariants}>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span>Amount (₹)</span>
                  </label>
                  <motion.div
                    variants={inputVariants}
                    whileFocus="focus"
                  >
                    <Input 
                      ref={linkRef}
                      placeholder="0.00"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-all duration-200" 
                    /> 
                  </motion.div>
                </motion.div>

                {/* Date Picker */}
                <motion.div className="space-y-3" variants={itemVariants}>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span>Date</span>
                  </label>
                  <motion.div 
                    className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-600"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Calender onChange={(date: Date) => setSelectedDate(date)} />
                  </motion.div>
                </motion.div>

                {/* Category Selector */}
                <motion.div className="space-y-3" variants={itemVariants}>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Tag className="h-4 w-4 text-purple-500" />
                    <span>Category</span>
                  </label>
                  <motion.div 
                    className="relative"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <select
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      value={selectedCategory}
                      className="w-full px-4 py-3 text-base bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 cursor-pointer appearance-none transition-all duration-200"
                    >
                      <option value="">Select a category</option>
                      <option value="Food">🍕 Food</option>
                      <option value="Transport">🚗 Transport</option>
                      <option value="Entertainment">🎬 Entertainment</option>
                      <option value="Bills">📄 Bills</option>
                      <option value="Other">📦 Other</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border-2 border-red-200 dark:border-red-800"
                      initial={{ opacity: 0, y: -10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Enhanced Footer - Seamlessly blended */}
              <motion.div 
                className="p-6 rounded-b-2xl"
                variants={itemVariants}
              >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Left side - Status and Info */}
                  <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-teal-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">Ready to add expense</span>
                    </div>
                    <div className="hidden sm:block text-gray-400">•</div>
                    <div className="hidden sm:flex items-center space-x-1">
                      <span className="text-xs">All fields required</span>
                    </div>
                  </div>

                  {/* Right side - Action buttons */}
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        onClick={onClose}
                        variant="outline"
                        className="px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl font-medium transition-all duration-200 min-w-[100px]"
                      >
                        <span className="flex items-center justify-center">
                          <span>Cancel</span>
                        </span>
                      </Button>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        onClick={addContent}
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 hover:from-teal-500 hover:via-cyan-500 hover:to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] h-12"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center space-x-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            <span>Adding...</span>
                          </div>
                        ) : (
                          <span className="flex items-center space-x-2">
                            <Plus className="h-5 w-5" />
                            <span>Add Expense</span>
                          </span>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </div>

                {/* Bottom separator with branding */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 dark:text-gray-500">
                    <div className="h-1 w-1 bg-teal-400 rounded-full"></div>
                    <span>PocketGuard Expense Tracker</span>
                    <div className="h-1 w-1 bg-cyan-400 rounded-full"></div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}

