import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import AppDataSource from '../config/data-source';
import { User } from '../entities/User';

const router = Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// Verify Google ID token
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Decode token payload for debugging 
    try {
      const parts = token.split('.');
      if (parts.length >= 2) {
        const payloadJson = Buffer.from(parts[1], 'base64').toString('utf8');
        const payload = JSON.parse(payloadJson);
        console.debug('Incoming ID token payload (decoded):', { aud: payload.aud, azp: payload.azp });
      }
    } catch (dErr) {
      console.debug('Failed to decode token payload for debug:', dErr);
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

    // Persist or upsert user in DB
    try {
      if (!AppDataSource.isInitialized) {
        // If datasource isn't initialized for some reason, try to initialize (safe-guard)
        await AppDataSource.initialize();
      }

      const userRepo = AppDataSource.getRepository(User);

      // Try find existing user by googleId or email
      let dbUser = await userRepo.findOne({ where: [{ googleId: payload.sub }, { email: payload.email || '' }] });

      if (dbUser) {
        // update fields if changed
        dbUser.googleId = payload.sub;
        dbUser.email = payload.email || dbUser.email;
        dbUser.name = payload.name || dbUser.name;
        await userRepo.save(dbUser);
      } else {
        dbUser = userRepo.create({
          googleId: payload.sub,
          email: payload.email || '',
          name: payload.name || undefined,
        } as Partial<User>);
        await userRepo.save(dbUser);
      }
      // Create application JWT signed with DB user id (so we can use it as owner id)
      const appToken = jwt.sign({ sub: dbUser.id, email: dbUser.email, name: dbUser.name }, JWT_SECRET, { expiresIn: '7d' });

      // Return normalized user object (use DB id)
      const returnedUser = {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
      };

      res.json({ user: returnedUser, token: appToken });
    } catch (dbErr) {
      console.error('DB upsert error:', dbErr);
      // Even if DB upsert fails, return token so frontend can still use app token.
      // In this fallback case we only have the google sub as id
      const fallbackToken = jwt.sign({ sub: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ user, token: fallbackToken });
    }
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