import { Document, Schema, model } from 'mongoose';
import { UserRole } from '../enums/UserRole.js';

// type UserRole = 'USER' | 'GYM_ADMIN' | 'ADMIN';

type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  isVerified: boolean;
  profilePhoto: string | null;
  primaryGymId: Schema.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },

    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'BLOCKED'],
      default: 'ACTIVE',
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    profilePhoto: {
      type: String,
      default: null,
    },

    primaryGymId: {
      type: Schema.Types.ObjectId,
      ref: 'Gym',
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const User = model<IUser>('User', userSchema);

export default User;
