import { getIsMongoConnected, loadLocalDB, saveLocalDB } from './db';
import { Player } from '../models/Player';
import { GalleryItem } from '../models/GalleryItem';
import { News } from '../models/News';
import { Match } from '../models/Match';
import { Registration } from '../models/Registration';
import { Payment } from '../models/Payment';
import crypto from 'crypto';

export const DataService = {
  // PLAYERS
  async getPlayers(query: any = {}) {
    if (getIsMongoConnected()) {
      return await Player.find(query).sort({ category: 1, jerseyNumber: 1 });
    }
    const db = loadLocalDB();
    return db.players.filter((p: any) => {
      let match = true;
      if (query.academy && p.academy !== query.academy) match = false;
      if (query.category && p.category !== query.category) match = false;
      return match;
    });
  },

  async addPlayer(data: any) {
    if (getIsMongoConnected()) {
      const p = new Player(data);
      return await p.save();
    }
    const db = loadLocalDB();
    const newPlayer = {
      _id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString()
    };
    db.players.push(newPlayer);
    saveLocalDB(db);
    return newPlayer;
  },

  async updatePlayer(id: string, data: any) {
    if (getIsMongoConnected()) {
      return await Player.findByIdAndUpdate(id, data, { new: true });
    }
    const db = loadLocalDB();
    const idx = db.players.findIndex((p: any) => p._id === id);
    if (idx !== -1) {
      db.players[idx] = { ...db.players[idx], ...data };
      saveLocalDB(db);
      return db.players[idx];
    }
    return null;
  },

  async deletePlayer(id: string) {
    if (getIsMongoConnected()) {
      return await Player.findByIdAndDelete(id);
    }
    const db = loadLocalDB();
    const initialLen = db.players.length;
    db.players = db.players.filter((p: any) => p._id !== id);
    saveLocalDB(db);
    return db.players.length < initialLen;
  },

  // GALLERY
  async getGallery(query: any = {}) {
    if (getIsMongoConnected()) {
      return await GalleryItem.find(query).sort({ createdAt: -1 });
    }
    const db = loadLocalDB();
    return db.gallery.filter((g: any) => {
      let match = true;
      if (query.academy && query.academy !== 'all' && g.academy !== 'all' && g.academy !== query.academy) match = false;
      if (query.category && query.category !== 'all' && g.category !== query.category) match = false;
      return match;
    }).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async addGalleryItem(data: any) {
    if (getIsMongoConnected()) {
      const g = new GalleryItem(data);
      return await g.save();
    }
    const db = loadLocalDB();
    const newItem = {
      _id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString()
    };
    db.gallery.unshift(newItem);
    saveLocalDB(db);
    return newItem;
  },

  async deleteGalleryItem(id: string) {
    if (getIsMongoConnected()) {
      return await GalleryItem.findByIdAndDelete(id);
    }
    const db = loadLocalDB();
    const initialLen = db.gallery.length;
    db.gallery = db.gallery.filter((g: any) => g._id !== id);
    saveLocalDB(db);
    return db.gallery.length < initialLen;
  },

  // NEWS
  async getNews(query: any = {}) {
    if (getIsMongoConnected()) {
      return await News.find(query).sort({ createdAt: -1 });
    }
    const db = loadLocalDB();
    return db.news.filter((n: any) => {
      let match = true;
      if (query.academy && query.academy !== 'all' && n.academy !== 'all' && n.academy !== query.academy) match = false;
      return match;
    }).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async addNews(data: any) {
    if (getIsMongoConnected()) {
      const n = new News(data);
      return await n.save();
    }
    const db = loadLocalDB();
    const newItem = {
      _id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString()
    };
    db.news.unshift(newItem);
    saveLocalDB(db);
    return newItem;
  },

  async deleteNews(id: string) {
    if (getIsMongoConnected()) {
      return await News.findByIdAndDelete(id);
    }
    const db = loadLocalDB();
    const initialLen = db.news.length;
    db.news = db.news.filter((n: any) => n._id !== id);
    saveLocalDB(db);
    return db.news.length < initialLen;
  },

  // MATCHES
  async getMatches(query: any = {}) {
    if (getIsMongoConnected()) {
      return await Match.find(query).sort({ date: 1 });
    }
    const db = loadLocalDB();
    return db.matches.filter((m: any) => {
      let match = true;
      if (query.academy && m.academy !== query.academy) match = false;
      if (query.category && m.category !== query.category) match = false;
      if (query.status && m.status !== query.status) match = false;
      return match;
    });
  },

  async addMatch(data: any) {
    if (getIsMongoConnected()) {
      const m = new Match(data);
      return await m.save();
    }
    const db = loadLocalDB();
    const newMatch = {
      _id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString()
    };
    db.matches.push(newMatch);
    saveLocalDB(db);
    return newMatch;
  },

  async updateMatch(id: string, data: any) {
    if (getIsMongoConnected()) {
      return await Match.findByIdAndUpdate(id, data, { new: true });
    }
    const db = loadLocalDB();
    const idx = db.matches.findIndex((m: any) => m._id === id);
    if (idx !== -1) {
      db.matches[idx] = { ...db.matches[idx], ...data };
      saveLocalDB(db);
      return db.matches[idx];
    }
    return null;
  },

  async deleteMatch(id: string) {
    if (getIsMongoConnected()) {
      return await Match.findByIdAndDelete(id);
    }
    const db = loadLocalDB();
    const initialLen = db.matches.length;
    db.matches = db.matches.filter((m: any) => m._id !== id);
    saveLocalDB(db);
    return db.matches.length < initialLen;
  },

  // REGISTRATIONS
  async getRegistrations() {
    if (getIsMongoConnected()) {
      return await Registration.find().sort({ createdAt: -1 });
    }
    const db = loadLocalDB();
    return db.registrations.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async addRegistration(data: any) {
    if (getIsMongoConnected()) {
      const r = new Registration(data);
      return await r.save();
    }
    const db = loadLocalDB();
    const newReg = {
      _id: crypto.randomUUID(),
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    db.registrations.unshift(newReg);
    saveLocalDB(db);
    return newReg;
  },

  async updateRegistrationStatus(id: string, status: string) {
    if (getIsMongoConnected()) {
      return await Registration.findByIdAndUpdate(id, { status }, { new: true });
    }
    const db = loadLocalDB();
    const idx = db.registrations.findIndex((r: any) => r._id === id);
    if (idx !== -1) {
      db.registrations[idx].status = status;
      saveLocalDB(db);
      return db.registrations[idx];
    }
    return null;
  },

  async getRegistrationById(id: string) {
    if (getIsMongoConnected()) {
      return await Registration.findById(id);
    }
    const db = loadLocalDB();
    return db.registrations.find((r: any) => r._id === id) || null;
  },

  async markRegistrationPaid(idOrEmail: string, paymentData: { tx_ref: string; transaction_id: string; amount: number }) {
    if (getIsMongoConnected()) {
      // Find either by ID or by email
      const filter = mongooseValidId(idOrEmail) ? { _id: idOrEmail } : { email: idOrEmail };
      return await Registration.findOneAndUpdate(
        filter,
        {
          paymentStatus: 'paid',
          paymentAmount: paymentData.amount,
          paymentTxRef: paymentData.tx_ref,
          paymentTransactionId: paymentData.transaction_id,
          paidAt: new Date()
        },
        { new: true }
      );
    }
    const db = loadLocalDB();
    const idx = db.registrations.findIndex((r: any) => r._id === idOrEmail || r.email === idOrEmail);
    if (idx !== -1) {
      db.registrations[idx].paymentStatus = 'paid';
      db.registrations[idx].paymentAmount = paymentData.amount;
      db.registrations[idx].paymentTxRef = paymentData.tx_ref;
      db.registrations[idx].paymentTransactionId = paymentData.transaction_id;
      db.registrations[idx].paidAt = new Date().toISOString();
      saveLocalDB(db);
      return db.registrations[idx];
    }
    return null;
  },

  // PAYMENTS
  async createPaymentRecord(data: any) {
    if (getIsMongoConnected()) {
      const existing = await Payment.findOne({ tx_ref: data.tx_ref });
      if (existing) {
        return existing;
      }
      const payment = new Payment(data);
      return await payment.save();
    }
    const db = loadLocalDB();
    if (!db.payments) db.payments = [];
    const existing = db.payments.find((p: any) => p.tx_ref === data.tx_ref);
    if (existing) {
      return existing;
    }
    const newPayment = {
      _id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString()
    };
    db.payments.unshift(newPayment);
    saveLocalDB(db);
    return newPayment;
  },

  async getPaymentByTxRef(tx_ref: string) {
    if (getIsMongoConnected()) {
      return await Payment.findOne({ tx_ref });
    }
    const db = loadLocalDB();
    return (db.payments || []).find((p: any) => p.tx_ref === tx_ref) || null;
  },

  async getPaymentByTransactionId(transaction_id: string) {
    if (getIsMongoConnected()) {
      return await Payment.findOne({ transaction_id });
    }
    const db = loadLocalDB();
    return (db.payments || []).find((p: any) => p.transaction_id === transaction_id) || null;
  },

  async getAllPayments() {
    if (getIsMongoConnected()) {
      return await Payment.find().sort({ createdAt: -1 });
    }
    const db = loadLocalDB();
    return (db.payments || []).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
};

function mongooseValidId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

