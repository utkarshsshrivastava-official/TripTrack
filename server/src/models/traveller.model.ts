import mongoose, { Schema, Document } from 'mongoose';

export interface ITravellerElderCareNotes {
  dailyMeds: string[];
  altitudeAlertThresholdMeters: number;
  specialCare: string;
}

export interface ITraveller extends Document {
  id: string;
  duoId: 'DUO_A' | 'DUO_B';
  name: string;
  role: 'COORDINATOR' | 'ELDER';
  relation: string;
  age: number;
  bloodGroup: string;
  emergencyContact: string;
  avatarColor: string;
  isSeniorCitizen: boolean;
  elderCareNotes?: ITravellerElderCareNotes;
  createdAt: Date;
  updatedAt: Date;
}

const TravellerSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    duoId: { type: String, required: true, enum: ['DUO_A', 'DUO_B'] },
    name: { type: String, required: true },
    role: { type: String, required: true, enum: ['COORDINATOR', 'ELDER'] },
    relation: { type: String, required: true },
    age: { type: Number, required: true },
    bloodGroup: { type: String, required: true },
    emergencyContact: { type: String, required: true },
    avatarColor: { type: String, required: true },
    isSeniorCitizen: { type: Boolean, required: true, default: false },
    elderCareNotes: {
      dailyMeds: [{ type: String }],
      altitudeAlertThresholdMeters: { type: Number, default: 2000 },
      specialCare: { type: String, default: '' }
    }
  },
  { timestamps: true }
);

export const TravellerModel = mongoose.model<ITraveller>('Traveller', TravellerSchema);
