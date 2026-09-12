import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  title: string;
  amountINR: number;
  paidBy: string;
  category: 'FOOD' | 'TOLL_TAXI' | 'RITUAL' | 'PORTER_DANDI' | 'HOTEL' | 'MISC';
  receiptUrl?: string;
  createdAt: Date;
}

const ExpenseSchema = new Schema({
  title: { type: String, required: true },
  amountINR: { type: Number, required: true },
  paidBy: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['FOOD', 'TOLL_TAXI', 'RITUAL', 'PORTER_DANDI', 'HOTEL', 'MISC'], 
    required: true 
  },
  receiptUrl: { type: String }
}, { timestamps: true });

export const ExpenseModel = mongoose.model<IExpense>('Expense', ExpenseSchema);
