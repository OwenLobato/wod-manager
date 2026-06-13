import mongoose, { Schema, type Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  roles: string[];
  preferences: {
    theme: 'light' | 'dark';
    language: 'es' | 'en';
    unit: 'lb' | 'kg';
    percentRange: number;
  };
  box?: mongoose.Types.ObjectId;
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
    roles: { type: [String], default: ['athlete'] },
    preferences: {
      theme: { type: String, enum: ['light', 'dark'], default: 'light' },
      language: { type: String, enum: ['es', 'en'], default: 'es' },
      unit: { type: String, enum: ['lb', 'kg'], default: 'lb' },
      percentRange: { type: Number, default: 10 },
    },
    box: { type: Schema.Types.ObjectId, ref: 'Box' },
    tokenVersion: { type: Number, default: 0 }, // bumped on logout/reset to revoke refresh tokens
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
