import mongoose, { Schema, Document } from 'mongoose';

export interface IPlayer extends Document {
  name: string;
  academy: 'next_pro' | 'angels';
  category: 'u10' | 'u13' | 'u15' | 'u17' | 'free_age';
  position: 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';
  jerseyNumber: number;
  age: number;
  photoUrl: string;
  bio?: string;
  stats: {
    appearances: number;
    goals: number;
    assists: number;
    cleanSheets?: number;
  };
  featured?: boolean;
  createdAt: Date;
}

const PlayerSchema = new Schema<IPlayer>({
  name: { type: String, required: true },
  academy: { type: String, enum: ['next_pro', 'angels'], required: true },
  category: { type: String, enum: ['u10', 'u13', 'u15', 'u17', 'free_age'], required: true },
  position: { type: String, enum: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'], required: true },
  jerseyNumber: { type: Number, required: true },
  age: { type: Number, required: true },
  photoUrl: { type: String, required: true },
  bio: { type: String, default: '' },
  stats: {
    appearances: { type: Number, default: 0 },
    goals: { type: Number, default: 0 },
    assists: { type: Number, default: 0 },
    cleanSheets: { type: Number, default: 0 }
  },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const Player = mongoose.model<IPlayer>('Player', PlayerSchema);
