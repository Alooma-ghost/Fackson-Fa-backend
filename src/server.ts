import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './config/db';
import { seedDatabase } from './seed';
import authRoutes from './routes/authRoutes';
import uploadRoutes from './routes/uploadRoutes';
import playerRoutes from './routes/playerRoutes';
import galleryRoutes from './routes/galleryRoutes';
import newsRoutes from './routes/newsRoutes';
import matchRoutes from './routes/matchRoutes';
import registrationRoutes from './routes/registrationRoutes';
import paymentRoutes from './routes/paymentRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'verif-hash']
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static uploads directory
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/payment', paymentRoutes);

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    academy: 'Fackson Football Academy',
    squads: {
      men: 'Fackson Next Pro (U10, U13, U17, Free Age)',
      women: 'Fackson Angels (U10, U13, U17, Free Age)'
    },
    timestamp: new Date().toISOString()
  });
});

// Start server and initialize database
const startServer = async () => {
  await connectDB();
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`⚽ Fackson Football Academy API running on port ${PORT}`);
    console.log(`📁 Uploads served at http://localhost:${PORT}/uploads`);
    console.log(`🔒 Admin default login available: username=admin, password=fackson2026!`);
  });
};

startServer();
