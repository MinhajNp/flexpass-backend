import mongoose, { Schema, Document } from "mongoose"
import { GymStatus } from "../../../shared/enums/gymStatus.enum"

export interface IGym extends Document {
  gymName: string
  city: string
  fullAddress: string
  contactPhone: string
  officialEmail: string
  
  ownerName: string
  ownerContact: string
  ownerEmail: string
  
  description?: string
  facilities?: string[]
  
  documents: {
    name: string
    url: string
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
  }[]
  
  bankDetails: {
    accountHolder: string
    bankName: string
    accountNumber: string
    ifscCode: string
  }
  
  agreedToTerms: boolean
  status: GymStatus
  rejectionReason?: string

  adminFullName?: string
  adminContactNumber?: string

  invitationToken?: string | null
  invitationTokenExpiresAt?: Date | null
  
  category: 'BASIC' | 'STANDARD' | 'PREMIUM'
  isEmergencyMode: {
    active: boolean;
    activated_at?: Date;
    reason?: string;
    expected_opening_date?: Date;
  }
}

const gymSchema = new Schema<IGym>(
  {
    gymName: {
      type: String,
      required: true
    },

    city: {
      type: String,
      required: true
    },

    fullAddress: {
      type: String,
      required: true
    },

    contactPhone: {
      type: String,
      required: true
    },

    officialEmail: {
      type: String,
      required: true
    },

    ownerName: {
      type: String,
      required: true
    },

    ownerContact: {
      type: String,
      required: true
    },

    ownerEmail: {
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
        name: { type: String, required: true },
        url: { type: String, required: true },
        status: {
          type: String,
          enum: ['PENDING', 'APPROVED', 'REJECTED'],
          default: 'PENDING'
        }
      }
    ],

    bankDetails: {
      accountHolder: { type: String, required: true },
      bankName: { type: String, required: true },
      accountNumber: { type: String, required: true },
      ifscCode: { type: String, required: true }
    },

    agreedToTerms: {
      type: Boolean,
      required: true
    },

    status: {
      type: String,
      enum: Object.values(GymStatus),
      default: GymStatus.PENDING
    },

    rejectionReason: {
      type: String
    },

    adminFullName: {
      type: String
    },

    adminContactNumber: {
      type: String
    },

    category: {
      type: String,
      enum: ['BASIC', 'STANDARD', 'PREMIUM'],
      default: 'BASIC'
    },

    isEmergencyMode: {
      active: { type: Boolean, default: false },
      activated_at: { type: Date },
      reason: { type: String },
      expected_opening_date: { type: Date }
    },

    invitationToken: {
      type: String,
      default: null
    },

    invitationTokenExpiresAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
)

export const Gym = mongoose.model<IGym>("Gym", gymSchema)