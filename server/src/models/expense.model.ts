import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  id: string;
  title: string;
  amountINR: number;
  paidBy: string;
  category: 'FOOD' | 'TOLL_TAXI' | 'RITUAL' | 'PORTER_DANDI' | 'HOTEL' | 'MISC';
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
    enum: ['FOOD', 'TOLL_TAXI', 'RITUAL', 'PORTER_DANDI', 'HOTEL', 'MISC'], 
    required: true 
  },
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
  }
}, { timestamps: true });

export const ExpenseModel = mongoose.model<IExpense>('Expense', ExpenseSchema);
