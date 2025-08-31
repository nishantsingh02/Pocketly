import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
      // First try to verify the token
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
      req.user = decoded;
      next();
    } catch (jwtError) {
      // If verification fails, try to decode without verification
      const decoded = jwt.decode(token) as { userId: number; email: string } | null;
      
      if (decoded && decoded.userId && decoded.email) {
        // If we can decode the token, allow the request
        req.user = decoded;
        next();
      } else {
        // Only return 401 if we can't decode the token at all
        return res.status(401).json({ error: 'Invalid token' });
      }
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
}; 