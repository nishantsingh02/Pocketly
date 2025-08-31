
import express from "express";
import {
  getMilestones,
  createMilestone,
  markMilestoneCompleted,
  deleteMilestone,
  editMilestone, 
} from "../controllers/milestoneController";

const router = express.Router();

// Route to fetch all milestones for a user
router.get("/milestones/:userId", getMilestones);

// Route to create a new milestone
router.post("/milestones/:userId", createMilestone);

// Route to mark a milestone as completed
router.patch("/milestones/:id", markMilestoneCompleted);

// Route to delete a milestone
router.delete("/milestones/:id", deleteMilestone);

// Route to edit a milestone
router.put("/milestones/:id", editMilestone);  

export default router;
