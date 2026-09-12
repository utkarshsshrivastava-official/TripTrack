import mongoose, { Schema, Document } from 'mongoose';

export interface ICheckpoint {
  id: string;
  name: string;
  estimatedTime: string;
  done: boolean;
  completedAt?: Date;
  elderComfortNote?: string;
}

export interface ISegment extends Document {
  id: string;
  title: string;
  origin: string;
  destination: string;
  departureTime: Date;
  arrivalTime: Date;
  mode: 'TRAIN' | 'CAB_PLAINS' | 'CAB_HILLS' | 'FLIGHT';
  status: 'UPCOMING' | 'IN_TRANSIT' | 'COMPLETED';
  logistics: {
    serviceName: string;
    identifier: string;
    driverPhone?: string;
    driverName?: string;
    pickupLocation: string;
    vehicleType?: string;
  };
  elevationMeters: number;
  isHighAltitude: boolean;
  checkpoints: ICheckpoint[];
}

const CheckpointSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  estimatedTime: { type: String, required: true },
  done: { type: Boolean, default: false },
  completedAt: { type: Date },
  elderComfortNote: { type: String }
}, { _id: false });

const SegmentSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  mode: { 
    type: String, 
    enum: ['TRAIN', 'CAB_PLAINS', 'CAB_HILLS', 'FLIGHT'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['UPCOMING', 'IN_TRANSIT', 'COMPLETED'], 
    default: 'UPCOMING' 
  },
  logistics: {
    serviceName: { type: String, default: '' },
    identifier: { type: String, default: '' },
    driverPhone: { type: String },
    driverName: { type: String },
    pickupLocation: { type: String, default: '' },
    vehicleType: { type: String }
  },
  elevationMeters: { type: Number, default: 0 },
  isHighAltitude: { type: Boolean, default: false },
  checkpoints: [CheckpointSchema]
}, { timestamps: true });

export const SegmentModel = mongoose.model<ISegment>('Segment', SegmentSchema);
