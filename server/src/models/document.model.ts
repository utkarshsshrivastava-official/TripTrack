import mongoose, { Schema, Document } from 'mongoose';

export interface ITravelDocument extends Document {
  title: string;
  category: 'ID_CARD' | 'TRAIN_TICKET' | 'FLIGHT_PASS' | 'YATRA_PASS' | 'HOTEL_VOUCHER';
  fileUrl: string;
  fileType: string;
  passengerId: string;
  parsedData?: {
    pnr?: string;
    seatNumber?: string;
    yatraRegistrationNo?: string;
    validDate?: string;
    destinationOrHotel?: string;
    docType?: string;
  };
  createdAt: Date;
}

const DocumentSchema = new Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['ID_CARD', 'TRAIN_TICKET', 'FLIGHT_PASS', 'YATRA_PASS', 'HOTEL_VOUCHER'], 
    required: true 
  },
  fileUrl: { type: String, required: true },
  fileType: { type: String, required: true },
  passengerId: { type: String, required: true },
  parsedData: {
    pnr: String,
    seatNumber: String,
    yatraRegistrationNo: String,
    validDate: String,
    destinationOrHotel: String,
    docType: String
  }
}, { timestamps: true });

export const DocumentModel = mongoose.model<ITravelDocument>('Document', DocumentSchema);
