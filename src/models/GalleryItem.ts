import mongoose, { Schema, Document } from 'mongoose';

export interface IGalleryItem extends Document {
  title: string;
  caption?: string;
  category: string;
  academy: 'all' | 'next_pro' | 'angels';
  imageUrl: string;
  tags?: string[];
  createdAt: Date;
}

const GallerySchema = new Schema<IGalleryItem>({
  title: { type: String, required: true },
  caption: { type: String, default: '' },
  category: { 
    type: String, 
    default: 'training' 
  },
  academy: { 
    type: String, 
    enum: ['all', 'next_pro', 'angels'], 
    default: 'all' 
  },
  imageUrl: { type: String, required: true },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export const GalleryItem = mongoose.model<IGalleryItem>('GalleryItem', GallerySchema);
