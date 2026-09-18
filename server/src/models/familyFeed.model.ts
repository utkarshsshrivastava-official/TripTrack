import mongoose, { Schema, Document } from 'mongoose';

export interface IFamilyFeedItem extends Document {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: Date;
  speakerId: string;
  locationName: string;
  duoId: 'DUO_A' | 'DUO_B' | 'ALL';
  category?: string;
  statusBadge?: string;
  metadata?: any;
  createdAt: Date;
  updatedAt?: Date;
}

const FamilyFeedSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, required: true, index: true },
  speakerId: { type: String, required: true },
  locationName: { type: String, required: true },
  duoId: { type: String, enum: ['DUO_A', 'DUO_B', 'ALL'], default: 'ALL' },
  category: { type: String },
  statusBadge: { type: String },
  metadata: { type: Schema.Types.Mixed }
}, { timestamps: true });

export const FamilyFeedModel = mongoose.model<IFamilyFeedItem>('FamilyFeed', FamilyFeedSchema);
