import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export interface AuthRequest extends Request {
  userId?: string;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Invalid Authorization header format' });
  }

  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    // Expect payload.sub to be the DB user id (uuid)
    if (!payload || !payload.sub) {
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    req.userId = payload.sub;
    next();
  } catch (err) {
    console.error('JWT verify error:', err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export default requireAuth;
