import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const createMilestone = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { task, reward } = req.body;

  try {
    const newMilestone = await prisma.milestone.create({
      data: {
        task,
        reward,
        userId: parseInt(userId),
      },
    });
    res.status(201).json(newMilestone);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating milestone", error });
  }
};


export const getMilestones = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const milestones = await prisma.milestone.findMany({
      where: { userId: parseInt(userId) },
    });
    res.json(milestones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching milestones", error });
  }
};


export const markMilestoneCompleted = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const updatedMilestone = await prisma.milestone.update({
      where: { id: parseInt(id) },
      data: { completed: true },
    });
    res.json(updatedMilestone);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating milestone", error });
  }
};


export const deleteMilestone = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.milestone.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send(); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting milestone", error });
  }
};

export const editMilestone = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { task, reward, completed } = req.body;

  try {
    const updatedMilestone = await prisma.milestone.update({
      where: { id: parseInt(id) },
      data: {
        task,
        reward,
        completed: completed !== undefined ? completed : undefined, 
      },
    });
    res.json(updatedMilestone);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating milestone", error });
  }
};
