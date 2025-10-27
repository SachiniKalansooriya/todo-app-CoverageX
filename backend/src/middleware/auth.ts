import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export interface AuthRequest extends Request {
  userId?: string;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  // Support both Authorization header (Bearer) and HttpOnly cookie named 'token'
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader) {
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }

  // If not in header, try cookies (simple parse to avoid extra dependency)
  if (!token && req.headers.cookie) {
    const cookies = req.headers.cookie.split(';').map((c) => c.trim());
    for (const c of cookies) {
      const [name, ...rest] = c.split('=');
      if (name === 'token') {
        token = decodeURIComponent(rest.join('='));
        break;
      }
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Missing Authorization token' });
  }
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
