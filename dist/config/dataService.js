"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataService = void 0;
const db_1 = require("./db");
const Player_1 = require("../models/Player");
const GalleryItem_1 = require("../models/GalleryItem");
const News_1 = require("../models/News");
const Match_1 = require("../models/Match");
const Registration_1 = require("../models/Registration");
const Payment_1 = require("../models/Payment");
const crypto_1 = __importDefault(require("crypto"));
exports.DataService = {
    // PLAYERS
    async getPlayers(query = {}) {
        if ((0, db_1.getIsMongoConnected)()) {
            return await Player_1.Player.find(query).sort({ category: 1, jerseyNumber: 1 });
        }
        const db = (0, db_1.loadLocalDB)();
        return db.players.filter((p) => {
            let match = true;
            if (query.academy && p.academy !== query.academy)
                match = false;
            if (query.category && p.category !== query.category)
                match = false;
            return match;
        });
    },
    async addPlayer(data) {
        if ((0, db_1.getIsMongoConnected)()) {
            const p = new Player_1.Player(data);
            return await p.save();
        }
        const db = (0, db_1.loadLocalDB)();
        const newPlayer = {
            _id: crypto_1.default.randomUUID(),
            ...data,
            createdAt: new Date().toISOString()
        };
        db.players.push(newPlayer);
        (0, db_1.saveLocalDB)(db);
        return newPlayer;
    },
    async updatePlayer(id, data) {
        if ((0, db_1.getIsMongoConnected)()) {
            return await Player_1.Player.findByIdAndUpdate(id, data, { new: true });
        }
        const db = (0, db_1.loadLocalDB)();
        const idx = db.players.findIndex((p) => p._id === id);
        if (idx !== -1) {
            db.players[idx] = { ...db.players[idx], ...data };
            (0, db_1.saveLocalDB)(db);
            return db.players[idx];
        }
        return null;
    },
    async deletePlayer(id) {
        if ((0, db_1.getIsMongoConnected)()) {
            return await Player_1.Player.findByIdAndDelete(id);
        }
        const db = (0, db_1.loadLocalDB)();
        const initialLen = db.players.length;
        db.players = db.players.filter((p) => p._id !== id);
        (0, db_1.saveLocalDB)(db);
        return db.players.length < initialLen;
    },
    // GALLERY
    async getGallery(query = {}) {
        if ((0, db_1.getIsMongoConnected)()) {
            return await GalleryItem_1.GalleryItem.find(query).sort({ createdAt: -1 });
        }
        const db = (0, db_1.loadLocalDB)();
        return db.gallery.filter((g) => {
            let match = true;
            if (query.academy && query.academy !== 'all' && g.academy !== 'all' && g.academy !== query.academy)
                match = false;
            if (query.category && query.category !== 'all' && g.category !== query.category)
                match = false;
            return match;
        }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    async addGalleryItem(data) {
        if ((0, db_1.getIsMongoConnected)()) {
            const g = new GalleryItem_1.GalleryItem(data);
            return await g.save();
        }
        const db = (0, db_1.loadLocalDB)();
        const newItem = {
            _id: crypto_1.default.randomUUID(),
            ...data,
            createdAt: new Date().toISOString()
        };
        db.gallery.unshift(newItem);
        (0, db_1.saveLocalDB)(db);
        return newItem;
    },
    async deleteGalleryItem(id) {
        if ((0, db_1.getIsMongoConnected)()) {
            return await GalleryItem_1.GalleryItem.findByIdAndDelete(id);
        }
        const db = (0, db_1.loadLocalDB)();
        const initialLen = db.gallery.length;
        db.gallery = db.gallery.filter((g) => g._id !== id);
        (0, db_1.saveLocalDB)(db);
        return db.gallery.length < initialLen;
    },
    // NEWS
    async getNews(query = {}) {
        if ((0, db_1.getIsMongoConnected)()) {
            return await News_1.News.find(query).sort({ createdAt: -1 });
        }
        const db = (0, db_1.loadLocalDB)();
        return db.news.filter((n) => {
            let match = true;
            if (query.academy && query.academy !== 'all' && n.academy !== 'all' && n.academy !== query.academy)
                match = false;
            return match;
        }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    async addNews(data) {
        if ((0, db_1.getIsMongoConnected)()) {
            const n = new News_1.News(data);
            return await n.save();
        }
        const db = (0, db_1.loadLocalDB)();
        const newItem = {
            _id: crypto_1.default.randomUUID(),
            ...data,
            createdAt: new Date().toISOString()
        };
        db.news.unshift(newItem);
        (0, db_1.saveLocalDB)(db);
        return newItem;
    },
    async deleteNews(id) {
        if ((0, db_1.getIsMongoConnected)()) {
            return await News_1.News.findByIdAndDelete(id);
        }
        const db = (0, db_1.loadLocalDB)();
        const initialLen = db.news.length;
        db.news = db.news.filter((n) => n._id !== id);
        (0, db_1.saveLocalDB)(db);
        return db.news.length < initialLen;
    },
    // MATCHES
    async getMatches(query = {}) {
        if ((0, db_1.getIsMongoConnected)()) {
            return await Match_1.Match.find(query).sort({ date: 1 });
        }
        const db = (0, db_1.loadLocalDB)();
        return db.matches.filter((m) => {
            let match = true;
            if (query.academy && m.academy !== query.academy)
                match = false;
            if (query.category && m.category !== query.category)
                match = false;
            if (query.status && m.status !== query.status)
                match = false;
            return match;
        });
    },
    async addMatch(data) {
        if ((0, db_1.getIsMongoConnected)()) {
            const m = new Match_1.Match(data);
            return await m.save();
        }
        const db = (0, db_1.loadLocalDB)();
        const newMatch = {
            _id: crypto_1.default.randomUUID(),
            ...data,
            createdAt: new Date().toISOString()
        };
        db.matches.push(newMatch);
        (0, db_1.saveLocalDB)(db);
        return newMatch;
    },
    async updateMatch(id, data) {
        if ((0, db_1.getIsMongoConnected)()) {
            return await Match_1.Match.findByIdAndUpdate(id, data, { new: true });
        }
        const db = (0, db_1.loadLocalDB)();
        const idx = db.matches.findIndex((m) => m._id === id);
        if (idx !== -1) {
            db.matches[idx] = { ...db.matches[idx], ...data };
            (0, db_1.saveLocalDB)(db);
            return db.matches[idx];
        }
        return null;
    },
    async deleteMatch(id) {
        if ((0, db_1.getIsMongoConnected)()) {
            return await Match_1.Match.findByIdAndDelete(id);
        }
        const db = (0, db_1.loadLocalDB)();
        const initialLen = db.matches.length;
        db.matches = db.matches.filter((m) => m._id !== id);
        (0, db_1.saveLocalDB)(db);
        return db.matches.length < initialLen;
    },
    // REGISTRATIONS
    async getRegistrations() {
        if ((0, db_1.getIsMongoConnected)()) {
            return await Registration_1.Registration.find().sort({ createdAt: -1 });
        }
        const db = (0, db_1.loadLocalDB)();
        return db.registrations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    async addRegistration(data) {
        if ((0, db_1.getIsMongoConnected)()) {
            const r = new Registration_1.Registration(data);
            return await r.save();
        }
        const db = (0, db_1.loadLocalDB)();
        const newReg = {
            _id: crypto_1.default.randomUUID(),
            ...data,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        db.registrations.unshift(newReg);
        (0, db_1.saveLocalDB)(db);
        return newReg;
    },
    async updateRegistrationStatus(id, status) {
        if ((0, db_1.getIsMongoConnected)()) {
            return await Registration_1.Registration.findByIdAndUpdate(id, { status }, { new: true });
        }
        const db = (0, db_1.loadLocalDB)();
        const idx = db.registrations.findIndex((r) => r._id === id);
        if (idx !== -1) {
            db.registrations[idx].status = status;
            (0, db_1.saveLocalDB)(db);
            return db.registrations[idx];
        }
        return null;
    },
    async getRegistrationById(id) {
        if ((0, db_1.getIsMongoConnected)()) {
            return await Registration_1.Registration.findById(id);
        }
        const db = (0, db_1.loadLocalDB)();
        return db.registrations.find((r) => r._id === id) || null;
    },
    async markRegistrationPaid(idOrEmail, paymentData) {
        if ((0, db_1.getIsMongoConnected)()) {
            // Find either by ID or by email
            const filter = mongooseValidId(idOrEmail) ? { _id: idOrEmail } : { email: idOrEmail };
            return await Registration_1.Registration.findOneAndUpdate(filter, {
                paymentStatus: 'paid',
                paymentAmount: paymentData.amount,
                paymentTxRef: paymentData.tx_ref,
                paymentTransactionId: paymentData.transaction_id,
                paidAt: new Date()
            }, { new: true });
        }
        const db = (0, db_1.loadLocalDB)();
        const idx = db.registrations.findIndex((r) => r._id === idOrEmail || r.email === idOrEmail);
        if (idx !== -1) {
            db.registrations[idx].paymentStatus = 'paid';
            db.registrations[idx].paymentAmount = paymentData.amount;
            db.registrations[idx].paymentTxRef = paymentData.tx_ref;
            db.registrations[idx].paymentTransactionId = paymentData.transaction_id;
            db.registrations[idx].paidAt = new Date().toISOString();
            (0, db_1.saveLocalDB)(db);
            return db.registrations[idx];
        }
        return null;
    },
    // PAYMENTS
    async createPaymentRecord(data) {
        if ((0, db_1.getIsMongoConnected)()) {
            const existing = await Payment_1.Payment.findOne({ tx_ref: data.tx_ref });
            if (existing) {
                return existing;
            }
            const payment = new Payment_1.Payment(data);
            return await payment.save();
        }
        const db = (0, db_1.loadLocalDB)();
        if (!db.payments)
            db.payments = [];
        const existing = db.payments.find((p) => p.tx_ref === data.tx_ref);
        if (existing) {
            return existing;
        }
        const newPayment = {
            _id: crypto_1.default.randomUUID(),
            ...data,
            createdAt: new Date().toISOString()
        };
        db.payments.unshift(newPayment);
        (0, db_1.saveLocalDB)(db);
        return newPayment;
    },
    async getPaymentByTxRef(tx_ref) {
        if ((0, db_1.getIsMongoConnected)()) {
            return await Payment_1.Payment.findOne({ tx_ref });
        }
        const db = (0, db_1.loadLocalDB)();
        return (db.payments || []).find((p) => p.tx_ref === tx_ref) || null;
    },
    async getPaymentByTransactionId(transaction_id) {
        if ((0, db_1.getIsMongoConnected)()) {
            return await Payment_1.Payment.findOne({ transaction_id });
        }
        const db = (0, db_1.loadLocalDB)();
        return (db.payments || []).find((p) => p.transaction_id === transaction_id) || null;
    },
    async getAllPayments() {
        if ((0, db_1.getIsMongoConnected)()) {
            return await Payment_1.Payment.find().sort({ createdAt: -1 });
        }
        const db = (0, db_1.loadLocalDB)();
        return (db.payments || []).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
};
function mongooseValidId(id) {
    return /^[0-9a-fA-F]{24}$/.test(id);
}
