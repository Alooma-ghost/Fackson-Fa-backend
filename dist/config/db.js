"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveLocalDB = exports.loadLocalDB = exports.getIsMongoConnected = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
let isMongoConnected = false;
const connectDB = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri || uri.includes('<db_username>')) {
        console.warn('⚠️  MongoDB URI contains placeholder <db_username> or is not set.');
        console.warn('⚡ Active fallback: Local high-speed persistent JSON datastore enabled.');
        return false;
    }
    try {
        console.log('🔄 Attempting connection to MongoDB Atlas...');
        const conn = await mongoose_1.default.connect(uri, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
        isMongoConnected = true;
        return true;
    }
    catch (error) {
        console.warn(`⚠️  MongoDB Atlas connection error: ${error.message}`);
        console.warn('⚡ Seamlessly operating in Local Persistent Datastore mode (zero downtime).');
        isMongoConnected = false;
        return false;
    }
};
exports.connectDB = connectDB;
const getIsMongoConnected = () => isMongoConnected;
exports.getIsMongoConnected = getIsMongoConnected;
// Local JSON store fallback engine
const dataDir = path_1.default.join(__dirname, '../../data');
const dbFilePath = path_1.default.join(dataDir, 'db.json');
const loadLocalDB = () => {
    if (!fs_1.default.existsSync(dataDir)) {
        fs_1.default.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs_1.default.existsSync(dbFilePath)) {
        const initial = {
            players: [],
            gallery: [],
            news: [],
            matches: [],
            registrations: [],
            payments: []
        };
        fs_1.default.writeFileSync(dbFilePath, JSON.stringify(initial, null, 2));
        return initial;
    }
    try {
        const raw = fs_1.default.readFileSync(dbFilePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (!parsed.payments)
            parsed.payments = [];
        return parsed;
    }
    catch (e) {
        return { players: [], gallery: [], news: [], matches: [], registrations: [], payments: [] };
    }
};
exports.loadLocalDB = loadLocalDB;
const saveLocalDB = (data) => {
    if (!fs_1.default.existsSync(dataDir)) {
        fs_1.default.mkdirSync(dataDir, { recursive: true });
    }
    fs_1.default.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
};
exports.saveLocalDB = saveLocalDB;
