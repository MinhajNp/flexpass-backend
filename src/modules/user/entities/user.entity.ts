import mongoose, { Schema, Document } from "mongoose"
import { Role } from "../../../shared/enums/role.enum"
import { UserStatus } from "../../../shared/enums/userStatus.enum"

export interface IUser extends Document {
  name: string
  email: string
  password?: string
  googleId?: string
  picture?: string
  role: Role
  status: UserStatus
  isVerified: boolean
  active_membership?: any
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
      required: false
    },

    googleId: {
      type: String,
      required: false
    },

    picture: {
      type: String,
      required: false
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
      type: Schema.Types.Mixed,
      default: "no_plan"
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