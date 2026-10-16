"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Match = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const MatchSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: true },
    homeLogo: { type: String, default: '' },
    awayLogo: { type: String, default: '' },
    academy: { type: String, enum: ['next_pro', 'angels'], required: true },
    category: { type: String, enum: ['u10', 'u13', 'u15', 'u17', 'free_age'], required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    venue: { type: String, default: 'Meiran Field Estate - Ojokoro Housing Estate Field, Meiran Alagbado' },
    status: { type: String, enum: ['upcoming', 'completed', 'live'], default: 'upcoming' },
    homeScore: { type: Number, default: 0 },
    awayScore: { type: Number, default: 0 },
    competition: { type: String, default: 'Youth Elite Championship' },
    gameType: { type: String, default: '11 v 11' },
    scorers: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now }
});
exports.Match = mongoose_1.default.model('Match', MatchSchema);
