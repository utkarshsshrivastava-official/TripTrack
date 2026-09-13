import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage extends Document {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatarColor: string;
  senderType: 'PILGRIM' | 'GUEST';
  senderDuo?: string;
  text: string;
  timestamp: Date;
  status: 'sent' | 'delivered';
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    id: { type: String, required: true, unique: true, index: true },
    senderId: { type: String, required: true, index: true },
    senderName: { type: String, required: true },
    senderAvatarColor: { type: String, default: '#2563eb' },
    senderType: { 
      type: String, 
      enum: ['PILGRIM', 'GUEST'], 
      default: 'PILGRIM' 
    },
    senderDuo: { type: String },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, index: true },
    status: { 
      type: String, 
      enum: ['sent', 'delivered'], 
      default: 'delivered' 
    }
  },
  { timestamps: true }
);

export const ChatMessageModel = mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
