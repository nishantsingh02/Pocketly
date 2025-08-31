"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const app_1 = require("../app");
const router = express_1.default.Router();
// Middleware to authenticate token for all routes
router.use(auth_1.authMiddleware);
// Get transactions for the authenticated user
router.get('/transactions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        // Check if database is connected
        if (!(0, app_1.isDatabaseConnected)()) {
            console.log('Database not available, returning empty transactions');
            res.status(200).json([]);
            return;
        }
        const prisma = (0, app_1.getPrisma)();
        const transactions = yield prisma.expenses.findMany({
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
        const transformedTransactions = transactions.map((t) => ({
            id: t.id.toString(),
            description: t.name,
            amount: t.amount,
            category: t.category,
            date: t.date.toISOString()
        }));
        res.status(200).json(transformedTransactions);
    }
    catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
}));
// Add a new transaction for the authenticated user
router.post('/transactions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId; // Extract userId from authenticated request
        const { name, amount, date, category } = req.body; // Get the expense details from the request body
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized: User not authenticated' });
            return;
        }
        // Validates that name contains only letters
        if (!/^[A-Za-z\s]+$/.test(name)) {
            res.status(400).json({ error: 'Expense Name must contain only letters' });
            return;
        }
        // Check if database is connected
        if (!(0, app_1.isDatabaseConnected)()) {
            res.status(503).json({ error: 'Database not available' });
            return;
        }
        const prisma = (0, app_1.getPrisma)();
        const newTransaction = yield prisma.expenses.create({
            data: {
                userId, // Link the transaction to the authenticated user
                name,
                amount: Number(amount), // Ensure amount is a number
                category,
                date: new Date(date), // Ensure the date is stored as a Date object
            },
        });
        res.status(201).json(newTransaction); // Return the created transaction
    }
    catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ error: 'Failed to create transaction' });
        return;
    }
}));
// Delete a transaction for the authenticated user
router.delete('/transactions/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId; // Extract userId from authenticated request
        const expenseId = parseInt(req.params.id); // Get the expense ID from the URL parameter
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized: User not authenticated' });
            return;
        }
        // Check if database is connected
        if (!(0, app_1.isDatabaseConnected)()) {
            res.status(503).json({ error: 'Database not available' });
            return;
        }
        const prisma = (0, app_1.getPrisma)();
        const expense = yield prisma.expenses.findFirst({
            where: { id: expenseId, userId }, // Ensure the expense belongs to the authenticated user
        });
        if (!expense) {
            res.status(404).json({ error: 'Expense not found' });
            return;
        }
        yield prisma.expenses.delete({ where: { id: expenseId } }); // Delete the expense
        res.status(200).json({ message: 'Expense deleted successfully' });
        return;
    }
    catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ error: 'Failed to delete transaction' });
        return;
    }
}));
exports.default = router;
