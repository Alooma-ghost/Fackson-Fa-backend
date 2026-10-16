import mongoose, { Schema, Document } from 'mongoose';

export interface IMatch extends Document {
  title: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo?: string;
  awayLogo?: string;
  academy: 'next_pro' | 'angels';
  category: 'u10' | 'u13' | 'u15' | 'u17' | 'free_age';
  date: string;
  time: string;
  venue: string;
  status: 'upcoming' | 'completed' | 'live';
  homeScore?: number;
  awayScore?: number;
  competition: string;
  gameType?: string;
  scorers?: string[];
  createdAt: Date;
}

const MatchSchema = new Schema<IMatch>({
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

export const Match = mongoose.model<IMatch>('Match', MatchSchema);
