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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExpense = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, amount, date, category } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const expense = yield prisma.expenses.create({
            data: {
                name,
                amount,
                date: new Date(date),
                category,
                userId
            }
        });
        res.status(201).json(expense);
    }
    catch (error) {
        console.error("Error creating expense:", error);
        res.status(500).json({ error: "Failed to create expense" });
    }
});
exports.createExpense = createExpense;
