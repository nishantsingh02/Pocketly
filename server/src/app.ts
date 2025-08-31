import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import expenseRoutes from "./routes/expenseRoutes";
import authRoutes from './routes/auth';
import milestoneRoutes from './routes/milestoneRoutes'
import path from 'path';

// Load environment variables
dotenv.config();

const app = express();
const allowedOrigins = [
  "https://pocketly-mauve.vercel.app",
  "https://pocketly-server.vercel.app",
  "https://pocketly.onrender.com",
  "http://localhost:3000",
  "http://localhost:5173"
];

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    database: isDatabaseConnected() ? 'Connected' : 'Not connected'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use("/api", expenseRoutes);
app.use("/api", milestoneRoutes);

app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all route for handling any other requests
/*
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});*/

let prisma: PrismaClient;

// Initialize Prisma client without blocking server startup
const initializePrisma = async () => {
  try {
    prisma = new PrismaClient();
    await prisma.$connect();
    console.log("✅ Database connected successfully!");
    return true;
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error);
    console.log("⚠️  Server will continue running without database connection");
    console.log("⚠️  Some features may not work until database is available");
    return false;
  }
};

// Initialize database connection in background
initializePrisma();

// Export prisma instance and database status check
export const getPrisma = () => prisma;
export const isDatabaseConnected = () => prisma && prisma.$connect !== undefined;

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`JWT_SECRET is set: ${!!process.env.JWT_SECRET}`);
});

export default app;

