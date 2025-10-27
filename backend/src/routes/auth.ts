import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

const router = Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// Verify Google ID token, create/return app JWT and user info
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Verify ID token with Google
    const ticket = await googleClient.verifyIdToken({ idToken: token, audience: GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();

    if (!payload || !payload.sub) {
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    const user = {
      id: payload.sub,
      email: payload.email || '',
      name: payload.name || '',
      picture: payload.picture || undefined,
    };

    // Create application JWT (signed with server secret)
    const appToken = jwt.sign({ sub: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    // In a real app: persist or upsert user in DB here

    res.json({ user, token: appToken });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(401).json({ error: 'Authentication failed' });
  }
});

// Get current user from app JWT
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Invalid Authorization format' });

  try {
    const decoded = jwt.verify(parts[1], JWT_SECRET) as any;
    const user = {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name,
    };
    res.json(user);
  } catch (err) {
    console.error('Token verify failed:', err);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Logout (client should remove token; server-side invalidation would require token store)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;