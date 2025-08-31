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
exports.isDatabaseConnected = exports.getPrisma = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const expenseRoutes_1 = __importDefault(require("./routes/expenseRoutes"));
const auth_1 = __importDefault(require("./routes/auth"));
const milestoneRoutes_1 = __importDefault(require("./routes/milestoneRoutes"));
const path_1 = __importDefault(require("path"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const allowedOrigins = [
    "https://personal-expense-tracker-kohl.vercel.app",
    "https://personal-expense-tracker-xi.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173",
    "https://100xpay.vercel.app"
];
// Middleware
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        database: (0, exports.isDatabaseConnected)() ? 'Connected' : 'Not connected'
    });
});
// Routes
app.use('/api/auth', auth_1.default);
app.use("/api", expenseRoutes_1.default);
app.use("/api", milestoneRoutes_1.default);
app.use(express_1.default.static(path_1.default.join(__dirname, 'dist')));
// Catch-all route for handling any other requests
/*
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});*/
let prisma;
// Initialize Prisma client without blocking server startup
const initializePrisma = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        prisma = new client_1.PrismaClient();
        yield prisma.$connect();
        console.log("✅ Database connected successfully!");
        return true;
    }
    catch (error) {
        console.error("❌ Failed to connect to the database:", error);
        console.log("⚠️  Server will continue running without database connection");
        console.log("⚠️  Some features may not work until database is available");
        return false;
    }
});
// Initialize database connection in background
initializePrisma();
// Export prisma instance and database status check
const getPrisma = () => prisma;
exports.getPrisma = getPrisma;
const isDatabaseConnected = () => prisma && prisma.$connect !== undefined;
exports.isDatabaseConnected = isDatabaseConnected;
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`JWT_SECRET is set: ${!!process.env.JWT_SECRET}`);
});
exports.default = app;
