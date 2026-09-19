import mongoose, { Schema, Document } from 'mongoose';

export interface IPushSubscription extends Document {
  userId: string;
  userName: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PushSubscriptionSchema = new Schema<IPushSubscription>(
  {
    userId: { type: String, required: true, index: true },
    userName: { type: String, required: true },
    endpoint: { type: String, required: true, unique: true, index: true },
    keys: {
      p256dh: { type: String, required: true },
      auth: { type: String, required: true }
    },
    userAgent: { type: String }
  },
  { timestamps: true }
);

export const PushSubscriptionModel = mongoose.model<IPushSubscription>(
  'PushSubscription',
  PushSubscriptionSchema
);
