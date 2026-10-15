"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db_1 = require("./config/db");
const seed_1 = require("./seed");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const playerRoutes_1 = __importDefault(require("./routes/playerRoutes"));
const galleryRoutes_1 = __importDefault(require("./routes/galleryRoutes"));
const newsRoutes_1 = __importDefault(require("./routes/newsRoutes"));
const matchRoutes_1 = __importDefault(require("./routes/matchRoutes"));
const registrationRoutes_1 = __importDefault(require("./routes/registrationRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'verif-hash']
}));
app.use(express_1.default.json({ limit: '20mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '20mb' }));
// Static uploads directory
const uploadsPath = path_1.default.join(__dirname, '../uploads');
app.use('/uploads', express_1.default.static(uploadsPath));
// API Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/upload', uploadRoutes_1.default);
app.use('/api/players', playerRoutes_1.default);
app.use('/api/gallery', galleryRoutes_1.default);
app.use('/api/news', newsRoutes_1.default);
app.use('/api/matches', matchRoutes_1.default);
app.use('/api/registrations', registrationRoutes_1.default);
app.use('/api/payment', paymentRoutes_1.default);
// Health check route
app.get('/api/health', (req, res) => {
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
    await (0, db_1.connectDB)();
    await (0, seed_1.seedDatabase)();
    app.listen(PORT, () => {
        console.log(`⚽ Fackson Football Academy API running on port ${PORT}`);
        console.log(`📁 Uploads served at http://localhost:${PORT}/uploads`);
        console.log(`🔒 Admin default login available: username=admin, password=fackson2026!`);
    });
};
startServer();
