import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

let isMongoConnected = false;

export const connectDB = async (): Promise<boolean> => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<db_username>')) {
    console.warn('⚠️  MongoDB URI contains placeholder <db_username> or is not set.');
    console.warn('⚡ Active fallback: Local high-speed persistent JSON datastore enabled.');
    return false;
  }

  try {
    console.log('🔄 Attempting connection to MongoDB Atlas...');
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    isMongoConnected = true;
    return true;
  } catch (error: any) {
    console.warn(`⚠️  MongoDB Atlas connection error: ${error.message}`);
    console.warn('⚡ Seamlessly operating in Local Persistent Datastore mode (zero downtime).');
    isMongoConnected = false;
    return false;
  }
};

export const getIsMongoConnected = () => isMongoConnected;

// Local JSON store fallback engine
const dataDir = path.join(__dirname, '../../data');
const dbFilePath = path.join(dataDir, 'db.json');

export interface DBState {
  players: any[];
  gallery: any[];
  news: any[];
  matches: any[];
  registrations: any[];
  payments: any[];
}

export const loadLocalDB = (): DBState => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(dbFilePath)) {
    const initial: DBState = {
      players: [],
      gallery: [],
      news: [],
      matches: [],
      registrations: [],
      payments: []
    };
    fs.writeFileSync(dbFilePath, JSON.stringify(initial, null, 2));
    return initial;
  }
  try {
    const raw = fs.readFileSync(dbFilePath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed.payments) parsed.payments = [];
    return parsed;
  } catch (e) {
    return { players: [], gallery: [], news: [], matches: [], registrations: [], payments: [] };
  }
};

export const saveLocalDB = (data: DBState) => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
};
