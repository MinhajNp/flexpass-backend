import mongoose, { Schema, Document } from "mongoose"
import { GymStatus } from "../../enums/gymStatus.enum"

export interface IGym extends Document {
  name: string
  email: string
  phone: string
  location: string
  description?: string
  facilities?: string[]
  documents: string[]
  status: GymStatus
  rejectionReason?: string
}

const gymSchema = new Schema<IGym>(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    location: {
      type: String,
      required: true
    },

    description: {
      type: String
    },

    facilities: [
      {
        type: String
      }
    ],

    documents: [
      {
        type: String
      }
    ],

    status: {
      type: String,
      enum: Object.values(GymStatus),
      default: GymStatus.PENDING
    },

    rejectionReason: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

export const Gym = mongoose.model<IGym>("Gym", gymSchema)