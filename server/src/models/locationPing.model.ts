import mongoose, { Schema, Document } from 'mongoose';

export interface ILocationPing extends Document {
  passengerId: string;
  latitude: number;
  longitude: number;
  altitudeMeters?: number;
  batteryLevel?: number;
  checkpointName?: string;
  note?: string;
  elderVitalsNote?: string;
  deviceTimestamp: Date;
  serverReceivedAt: Date;
}

const LocationPingSchema = new Schema({
  passengerId: { type: String, required: true, index: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  altitudeMeters: { type: Number },
  batteryLevel: { type: Number },
  checkpointName: { type: String },
  note: { type: String },
  elderVitalsNote: { type: String },
  deviceTimestamp: { type: Date, required: true },
  serverReceivedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const LocationPingModel = mongoose.model<ILocationPing>('LocationPing', LocationPingSchema);
