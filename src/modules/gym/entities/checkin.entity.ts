import mongoose, { Schema, Document } from "mongoose";

export interface ICheckIn extends Document {
  userId: mongoose.Types.ObjectId;
  gymId: mongoose.Types.ObjectId;
  checkInType: 'Primary Gym' | 'Manual';
  status: 'Allowed' | 'Denied';
  createdAt: Date;
  updatedAt: Date;
}

const checkInSchema = new Schema<ICheckIn>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    gymId: { type: Schema.Types.ObjectId, ref: "Gym", required: true },
    checkInType: { type: String, enum: ['Primary Gym', 'Manual'], default: 'Primary Gym' },
    status: { type: String, enum: ['Allowed', 'Denied'], default: 'Allowed' },
  },
  { timestamps: true }
);

export const CheckIn = mongoose.model<ICheckIn>("CheckIn", checkInSchema);
