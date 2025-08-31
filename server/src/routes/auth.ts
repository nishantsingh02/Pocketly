import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { RequestHandler } from 'express';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Google OAuth2 client (replace with your Google client ID)
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID');

// Helper function to generate token with longer expiration
const generateToken = (userId: number, email: string): string => {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: '30d' } 
  );
};

// Register new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });
    
    // Generate JWT token
    const token = generateToken(user.id, user.email);

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Login user
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ error: 'Missing email or password' });
      return;
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email);

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Refresh token
router.post('/refresh-token', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    
    try {
      // First try to verify the token
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
      const newToken = generateToken(decoded.userId, decoded.email);
      res.json({ token: newToken });
    } catch (jwtError) {
      // If verification fails, try to decode without verification
      const decoded = jwt.decode(token) as { userId: number; email: string } | null;
      
      if (decoded && decoded.userId && decoded.email) {
        // Generate a new token if we can decode the old one
        const newToken = generateToken(decoded.userId, decoded.email);
        res.json({ token: newToken });
      } else {
        res.status(401).json({ error: 'Invalid token' });
      }
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Google Sign-In
const googleSignInHandler: RequestHandler = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      res.status(400).json({ error: 'No credential provided' });
      return;
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      res.status(400).json({ error: 'Invalid Google token' });
      return;
    }

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email: payload.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: payload.name || payload.email.split('@')[0],
          email: payload.email,
          password: Math.random().toString(36).slice(-8), // Dummy password for Google users
        },
      });
    }

    // Generate JWT
    const token = generateToken(user.id, user.email);
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ error: 'Google authentication failed' });
  }
};

router.post('/google', googleSignInHandler);

export default router; 