import mongoose, { Schema, Document } from "mongoose";

export interface ISlot extends Document {
  gymId: mongoose.Types.ObjectId;
  timeWindow: string; // e.g. "06:00 - 07:00"
  capacity: number;
  booked: number;
  available: number;
  status: 'Full' | 'Filling Fast' | 'Open';
  date: string; // YYYY-MM-DD
}

const slotSchema = new Schema<ISlot>(
  {
    gymId: { type: Schema.Types.ObjectId, ref: "Gym", required: true },
    timeWindow: { type: String, required: true },
    capacity: { type: Number, required: true },
    booked: { type: Number, default: 0 },
    available: { type: Number, required: true },
    status: { type: String, enum: ['Full', 'Filling Fast', 'Open'], default: 'Open' },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

export const Slot = mongoose.model<ISlot>("Slot", slotSchema);
