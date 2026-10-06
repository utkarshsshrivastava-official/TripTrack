import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  id: string;
  title: string;
  amountINR: number;
  paidBy: string;
  category: 'FOOD' | 'TOLL_TAXI' | 'RITUAL' | 'PORTER_DANDI' | 'HOTEL' | 'SHOPPING' | 'MEDICAL' | 'MISC';
  paymentMethod?: 'UPI' | 'CASH' | 'CARD' | 'NET_BANKING' | 'OTHER';
  tags?: string[];
  venueName?: string;
  venueLocation?: string;
  receiptUrl?: string;
  paymentSplits?: {
    utkarshPaidINR: number;
    shreyasPaidINR: number;
  };
  splitMode?: 'EQUAL_50_50' | 'CUSTOM_AMOUNTS' | 'FULL_FAMILY_A' | 'FULL_FAMILY_B';
  owedSplits?: {
    utkarshOwesINR: number;
    shreyasOwesINR: number;
  };
  cabDetails?: {
    transitType?: 'CAB' | 'AUTO' | 'TRAIN' | 'FLIGHT' | 'TOLL_PARKING' | 'OTHER';
    driverName?: string;
    vehicleNumber?: string;
    cabRouteOrPackage?: string;
    notes?: string;
  };
  createdAt: Date;
  updatedAt?: Date;
}

const ExpenseSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  amountINR: { type: Number, required: true },
  paidBy: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['FOOD', 'TOLL_TAXI', 'RITUAL', 'PORTER_DANDI', 'HOTEL', 'SHOPPING', 'MEDICAL', 'MISC'], 
    required: true 
  },
  paymentMethod: {
    type: String,
    enum: ['UPI', 'CASH', 'CARD', 'NET_BANKING', 'OTHER'],
    default: 'UPI'
  },
  tags: [{ type: String }],
  venueName: { type: String },
  venueLocation: { type: String },
  receiptUrl: { type: String },
  paymentSplits: {
    utkarshPaidINR: Number,
    shreyasPaidINR: Number
  },
  splitMode: {
    type: String,
    enum: ['EQUAL_50_50', 'CUSTOM_AMOUNTS', 'FULL_FAMILY_A', 'FULL_FAMILY_B'],
    default: 'EQUAL_50_50'
  },
  owedSplits: {
    utkarshOwesINR: Number,
    shreyasOwesINR: Number
  },
  cabDetails: {
    transitType: { 
      type: String, 
      enum: ['CAB', 'AUTO', 'TRAIN', 'FLIGHT', 'TOLL_PARKING', 'OTHER'],
      default: 'CAB'
    },
    driverName: { type: String },
    vehicleNumber: { type: String },
    cabRouteOrPackage: { type: String },
    notes: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: { createdAt: false, updatedAt: true } });

export const ExpenseModel = mongoose.model<IExpense>('Expense', ExpenseSchema);
