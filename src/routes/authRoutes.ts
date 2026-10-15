import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fackson_fa_secret_key_2026';

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const defaultUser = process.env.ADMIN_DEFAULT_USER || 'admin';
    const defaultPass = process.env.ADMIN_DEFAULT_PASS || 'fackson2026!';

    if (username === defaultUser && password === defaultPass) {
      const token = jwt.sign(
        { username, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      return res.json({
        success: true,
        token,
        admin: {
          username,
          role: 'Super Administrator',
          name: 'Fackson Academy Director'
        }
      });
    }

    return res.status(401).json({ success: false, message: 'Invalid admin username or password' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No authorization token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json({ success: true, user: decoded });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token is invalid or expired' });
  }
});

export default router;
