import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name?: string;  
  email: string;
  dob?: Date;    
  otp?: string;
  otpExpires?: Date;
  googleId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String },  
  email: { type: String, required: true, unique: true },
  dob: { type: Date },     
  otp: { type: String },
  otpExpires: { type: Date },
  googleId: { type: String }
}, { 
  timestamps: true 
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;