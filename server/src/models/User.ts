import mongoose, { Schema, type Document } from 'mongoose';

export const USER_ROLES = ['athlete', 'coach', 'judge', 'organizer', 'admin'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const ORGANIZER_STATUSES = ['none', 'pending', 'approved', 'rejected'] as const;
export type OrganizerStatus = (typeof ORGANIZER_STATUSES)[number];

export const USER_PLANS = ['free', 'pro', 'elite'] as const;
export type UserPlan = (typeof USER_PLANS)[number];

export const GENDERS = ['male', 'female'] as const;
export type Gender = (typeof GENDERS)[number];

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  roles: UserRole[];
  preferences: {
    theme: 'light' | 'dark';
    language: 'es' | 'en';
    unit: 'lb' | 'kg';
    percentRange: number;
  };
  box?: mongoose.Types.ObjectId;
  gender: Gender;
  birthDate?: Date;
  isPublic: boolean;
  avatarUrl?: string;
  bio?: string;
  organizerStatus: OrganizerStatus;
  plan: UserPlan;
  tokenVersion: number;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    roles: { type: [String], enum: [...USER_ROLES], default: ['athlete'] },
    preferences: {
      theme: { type: String, enum: ['light', 'dark'], default: 'light' },
      language: { type: String, enum: ['es', 'en'], default: 'es' },
      unit: { type: String, enum: ['lb', 'kg'], default: 'lb' },
      percentRange: { type: Number, default: 10 },
    },
    box: { type: Schema.Types.ObjectId, ref: 'Box' },
    gender: { type: String, enum: [...GENDERS] },
    birthDate: { type: Date },
    isPublic: { type: Boolean, default: true }, // participates in social comparison / rankings
    avatarUrl: { type: String },
    bio: { type: String, trim: true },
    organizerStatus: { type: String, enum: [...ORGANIZER_STATUSES], default: 'none' },
    plan: { type: String, enum: [...USER_PLANS], default: 'free' },
    tokenVersion: { type: Number, default: 0 }, // bumped on logout/reset to revoke refresh tokens
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
