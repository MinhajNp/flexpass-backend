import mongoose, { Schema, Document } from "mongoose"

export interface IRegistrationToken extends Document {
  gymId: mongoose.Schema.Types.ObjectId
  token: string
  isUsed: boolean
  expiresAt: Date
}

const registrationTokenSchema = new Schema<IRegistrationToken>(
  {
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gym",
      required: true
    },
    token: {
      type: String,
      required: true,
      unique: true
    },
    isUsed: {
      type: Boolean,
      default: false
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
)

// Index for automatic deletion after expiry
registrationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const RegistrationToken = mongoose.model<IRegistrationToken>("RegistrationToken", registrationTokenSchema)
