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
exports.Registration = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const RegistrationSchema = new mongoose_1.Schema({
    playerName: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
    academyPreference: { type: String, enum: ['next_pro', 'angels'], required: true },
    category: { type: String, enum: ['u10', 'u13', 'u15', 'u17', 'free_age'], required: true },
    parentName: { type: String, default: '' },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, default: '' },
    position: { type: String, required: true },
    experience: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'reviewed', 'invited'], default: 'pending' },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid', 'failed', 'pending'],
        default: 'unpaid'
    },
    paymentAmount: { type: Number, default: 0 },
    paymentTxRef: { type: String, default: '' },
    paymentTransactionId: { type: String, default: '' },
    paidAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
});
exports.Registration = mongoose_1.default.model('Registration', RegistrationSchema);
