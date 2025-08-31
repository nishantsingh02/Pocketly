import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, CheckCircle, Edit, Trash2, ChevronRight, Target, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { getMilestones, createMilestone, markAsCompleted, deleteMilestone, editMilestone } from "../config/milestoneApi";

type Milestone = {
  id: number;
  task: string;
  reward: string;
  completed: boolean;
};

export const MilestoneCards: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [task, setTask] = useState("");
  const [reward, setReward] = useState("");
  const [visibleCount, setVisibleCount] = useState(3);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Fetch milestones on mount
  useEffect(() => {
    const fetchMilestones = async () => {
      if (!user) return;  // Wait for user to be available
      try {
        const data = await getMilestones(user.id.toString()) as Milestone[];
        setMilestones(data);
      } catch (error) {
        console.error("Failed to fetch milestones", error);
      }
    };
    fetchMilestones();
  }, [user]);

  const addMilestone = async () => {
    if (!task.trim() || !reward.trim() || !user) return;
    try {
      const newMilestone = await createMilestone(user.id.toString(), task, reward) as Milestone;
      setMilestones((prev: Milestone[]) => [...prev, newMilestone]);
      setTask("");
      setReward("");
      setShowForm(false);
    } catch (error) {
      console.error("Failed to create milestone", error);
    }
  };

  const handleMarkCompleted = async (id: number) => {
    try {
      const updatedMilestone = await markAsCompleted(id) as Milestone;  // Explicitly cast to Milestone type
      setMilestones((prev) =>
        prev.map((m) => (m.id === id ? updatedMilestone : m))
      );
    } catch (error) {
      console.error("Failed to mark milestone as completed:", error);
    }
  };
  

  const handleDelete = async (id: number) => {
    try {
      await deleteMilestone(id);
      setMilestones((prev) => prev.filter((milestone) => milestone.id !== id));
    } catch (error) {
      console.error("Failed to delete milestone", error);
    }
  };

  const startEdit = (milestone: Milestone) => {
    setEditingId(milestone.id);
    setTask(milestone.task);
    setReward(milestone.reward);
    setShowForm(true);
  };

  const handleEdit = async () => {
    if (!task.trim() || !reward.trim() || editingId === null) return;
    
    try {
      const updatedMilestone = await editMilestone(editingId, task, reward) as Milestone;
      setMilestones((prev) =>
        prev.map((milestone) =>
          milestone.id === editingId ? { ...milestone, task: updatedMilestone.task, reward: updatedMilestone.reward } : milestone
        )
      );
      setTask("");
      setReward("");
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      console.error("Failed to edit milestone", error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setTask("");
    setReward("");
    setEditingId(null);
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
  
    const easeIn = cubicBezier(0.42, 0, 1, 1);
  const easeOut = cubicBezier(0.25, 1, 0.5, 1);
  const easeInOut = cubicBezier(0.42, 0, 0.58, 1);

  const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: easeOut // Use the variable here
    }
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: easeInOut // Use the variable here
    }
  },
  tap: {
    scale: 0.98
  }
};

const formVariants = {
  hidden: { opacity: 0, height: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    height: "auto",
    scale: 1,
    transition: {
      duration: 0.4,
      ease: easeOut // Use the variable here
    }
  },
  exit: {
    opacity: 0,
    height: 0,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: easeIn // Use the variable here
    }
  }
};

  if (!isAuthenticated) {
    return null;
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className="flex items-center justify-between" variants={cardVariants}>
        <div className="flex items-center space-x-3">
          <motion.div
            className="h-10 w-10 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-purple-800 to-pink-700 dark:from-white dark:via-purple-200 dark:to-pink-300 bg-clip-text text-transparent">
              Milestones & Goals
        </h2>
            <p className="text-sm text-muted-foreground">
              Track your progress and celebrate achievements
            </p>
          </div>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
          Add Milestone
        </Button>
        </motion.div>
      </motion.div>

      {/* Add/Edit Form */}
      <AnimatePresence>
      {showForm && (
          <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-xl p-6 shadow-xl border border-purple-100 dark:border-purple-800"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Task
              </label>
              <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                  placeholder="What do you want to achieve?"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all duration-200"
              />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reward
              </label>
              <input
                type="text"
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                  placeholder="What's your reward?"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all duration-200"
              />
              </div>
            </div>
            <div className="flex space-x-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
              <Button 
                  onClick={editingId ? handleEdit : addMilestone}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  {editingId ? 'Update' : 'Add'} Milestone
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
              <Button 
                variant="outline" 
                onClick={handleCancel}
                  className="hover:bg-gray-50 dark:hover:bg-slate-700"
              >
                Cancel
              </Button>
              </motion.div>
            </div>
          </motion.div>
      )}
      </AnimatePresence>

      {/* Milestones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {milestones.slice(0, visibleCount).map((milestone, index) => (
          <motion.div
                key={milestone.id}
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
            custom={index}
          >
            <div className={`relative group cursor-pointer transition-all duration-300 ${
                  milestone.completed
                ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-700' 
                : 'bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 border-gray-200 dark:border-gray-700'
            } border rounded-xl p-6 shadow-lg hover:shadow-xl backdrop-blur-xl`}>
              
              {/* Completion Status */}
              <div className="absolute top-4 right-4">
                {milestone.completed ? (
                  <motion.div
                    className="h-8 w-8 bg-emerald-500 rounded-full flex items-center justify-center text-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    className="h-8 w-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.1, backgroundColor: "#10b981" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleMarkCompleted(milestone.id)}
                  >
                    <CheckCircle className="h-4 w-4 text-gray-400" />
                  </motion.div>
                )}
              </div>

              {/* Content */}
              <div className="mb-4">
                <motion.h3 
                  className={`text-lg font-semibold mb-2 ${
                    milestone.completed 
                      ? 'text-emerald-700 dark:text-emerald-300 line-through' 
                      : 'text-gray-900 dark:text-white'
                  }`}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                    {milestone.task}
                </motion.h3>
                <motion.p 
                  className={`text-sm ${
                    milestone.completed 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  Reward: {milestone.reward}
                </motion.p>
                </div>
                
              {/* Actions */}
                    {!milestone.completed && (
                <div className="flex space-x-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="outline"
                      size="sm" 
                      onClick={() => startEdit(milestone)}
                      className="text-xs hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="outline"
                      size="sm" 
                      onClick={() => handleDelete(milestone.id)}
                      className="text-xs hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </motion.div>
                </div>
              )}

              {/* Completion Animation */}
              {milestone.completed && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              )}
              </div>
          </motion.div>
            ))}
          </div>
          
      {/* Show More Button */}
      {milestones.length > visibleCount && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
              <Button 
                variant="outline" 
              onClick={() => setVisibleCount(prev => prev + 3)}
              className="hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600 transition-colors"
              >
              Show More <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
          </motion.div>
        </motion.div>
      )}

      {/* Empty State */}
      {milestones.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="h-20 w-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-full flex items-center justify-center mx-auto mb-4"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Trophy className="h-10 w-10 text-purple-600 dark:text-purple-400" />
          </motion.div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No milestones yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start by adding your first milestone to track your progress
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Milestone
            </Button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};