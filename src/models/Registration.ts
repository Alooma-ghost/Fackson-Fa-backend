import mongoose, { Schema, Document } from 'mongoose';

export interface IRegistration extends Document {
  playerName: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  academyPreference: 'next_pro' | 'angels';
  category: 'u10' | 'u13' | 'u15' | 'u17' | 'free_age';
  parentName?: string;
  phone: string;
  email: string;
  address?: string;
  position: string;
  experience?: string;
  status: 'pending' | 'reviewed' | 'invited';
  paymentStatus: 'unpaid' | 'paid' | 'failed' | 'pending';
  paymentAmount?: number;
  paymentTxRef?: string;
  paymentTransactionId?: string;
  paidAt?: Date;
  createdAt: Date;
}

const RegistrationSchema = new Schema<IRegistration>({
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

export const Registration = mongoose.model<IRegistration>('Registration', RegistrationSchema);
