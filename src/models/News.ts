import mongoose, { Schema, Document } from 'mongoose';

export interface INews extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category?: 'match' | 'training' | 'alumni' | 'trials' | 'announcement';
  academy: 'all' | 'next_pro' | 'angels';
  author: string;
  date: string;
  featured: boolean;
  createdAt: Date;
}

const NewsSchema = new Schema<INews>({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  coverImage: { type: String, required: true },
  category: { type: String, default: 'match' },
  academy: { type: String, enum: ['all', 'next_pro', 'angels'], default: 'all' },
  author: { type: String, default: 'Fackson Media Team' },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const News = mongoose.model<INews>('News', NewsSchema);
