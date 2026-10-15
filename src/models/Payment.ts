import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  tx_ref: string;
  transaction_id: string;
  amount: number;
  currency: string;
  status: 'successful' | 'failed' | 'cancelled' | 'pending';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod?: string;
  registrationId?: string;
  academyPreference?: string;
  category?: string;
  flwMeta?: any;
  createdAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
  tx_ref: { type: String, required: true, unique: true, index: true },
  transaction_id: { type: String, required: true, index: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: 'NGN' },
  status: { 
    type: String, 
    enum: ['successful', 'failed', 'cancelled', 'pending'], 
    default: 'pending' 
  },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  paymentMethod: { type: String, default: 'card' },
  registrationId: { type: String, default: '' },
  academyPreference: { type: String, default: 'next_pro' },
  category: { type: String, default: 'u17' },
  flwMeta: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now }
});

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
