import express, { Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { getPrisma, isDatabaseConnected } from '../app';

const router = express.Router();

// Middleware to authenticate token for all routes
router.use(authMiddleware as express.RequestHandler);

// Get transactions for the authenticated user
router.get('/transactions', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Check if database is connected
    if (!isDatabaseConnected()) {
      console.log('Database not available, returning empty transactions');
      res.status(200).json([]);
      return;
    }

    const prisma = getPrisma();
    const transactions = await prisma.expenses.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      select: {
        id: true,
        name: true,
        amount: true,
        category: true,
        date: true
      }
    });

    // Transform the data to match frontend expectations
    const transformedTransactions = transactions.map((t: any) => ({
      id: t.id.toString(),
      description: t.name,
      amount: t.amount,
      category: t.category,
      date: t.date.toISOString()
    }));

    res.status(200).json(transformedTransactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Add a new transaction for the authenticated user
router.post('/transactions', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId; // Extract userId from authenticated request
    const { name, amount, date, category } = req.body; // Get the expense details from the request body

    if (!userId) {
       res.status(401).json({ error: 'Unauthorized: User not authenticated' })
       return;
    }

     // Validates that name contains only letters
     if (!/^[A-Za-z\s]+$/.test(name)) {
      res.status(400).json({ error: 'Expense Name must contain only letters' });
      return;
    }

    // Check if database is connected
    if (!isDatabaseConnected()) {
      res.status(503).json({ error: 'Database not available' });
      return;
    }

    const prisma = getPrisma();
    const newTransaction = await prisma.expenses.create({
      data: {
        userId, // Link the transaction to the authenticated user
        name,
        amount: Number(amount), // Ensure amount is a number
        category,
        date: new Date(date), // Ensure the date is stored as a Date object
      },
    });

    res.status(201).json(newTransaction); // Return the created transaction
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Failed to create transaction' })
    return;
  }
});

// Delete a transaction for the authenticated user
router.delete('/transactions/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId; // Extract userId from authenticated request
    const expenseId = parseInt(req.params.id); // Get the expense ID from the URL parameter

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized: User not authenticated' })
      return;
    }

    // Check if database is connected
    if (!isDatabaseConnected()) {
      res.status(503).json({ error: 'Database not available' });
      return;
    }

    const prisma = getPrisma();
    const expense = await prisma.expenses.findFirst({
      where: { id: expenseId, userId }, // Ensure the expense belongs to the authenticated user
    });

    if (!expense) {
     res.status(404).json({ error: 'Expense not found' });
     return;
    }

    await prisma.expenses.delete({ where: { id: expenseId } }); // Delete the expense

    res.status(200).json({ message: 'Expense deleted successfully' })
    return;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Failed to delete transaction' })
    return;
  }
});

export default router;
