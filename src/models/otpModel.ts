import { model, Schema, type Document } from 'mongoose';

export enum OtpPurpose {
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

interface IOtp extends Document {
  userId: Schema.Types.ObjectId;
  otpHash: string;
  expiresAt: Date;
  attempts: number;
  purpose: OtpPurpose;
  createdAt: Date;
  updatedAt: Date;
}

const otpSchema = new Schema<IOtp>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    otpHash: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    attempts: {
      type: Number,
      default: 0,
    },
    purpose: {
      type: String,
      enum: Object.values(OtpPurpose),
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Otp = model<IOtp>('Otp', otpSchema);

export type { IOtp };
export default Otp;
