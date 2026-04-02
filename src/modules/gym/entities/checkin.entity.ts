import mongoose, { Schema, Document } from "mongoose";

export interface ICheckIn extends Document {
  userId: mongoose.Types.ObjectId;
  gymId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const checkInSchema = new Schema<ICheckIn>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    gymId: { type: Schema.Types.ObjectId, ref: "Gym", required: true },
  },
  { timestamps: true }
);

export const CheckIn = mongoose.model<ICheckIn>("CheckIn", checkInSchema);
