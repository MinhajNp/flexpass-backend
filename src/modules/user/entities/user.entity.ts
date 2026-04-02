import mongoose, { Schema, Document } from "mongoose"
import { Role } from "../../../shared/enums/role.enum"
import { UserStatus } from "../../../shared/enums/userStatus.enum"

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: Role
  status: UserStatus
  isVerified: boolean
  active_membership?: {
    plan: string;
    expiryDate: Date;
  }
  check_in_count: number
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER
    },

    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.PENDING
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    active_membership: {
      plan: { type: String },
      expiryDate: { type: Date }
    },

    check_in_count: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

export const User = mongoose.model<IUser>("User", userSchema)