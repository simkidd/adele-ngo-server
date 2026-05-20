import mongoose, { Document } from "mongoose";

export interface ICenter extends Document {
  name: string;
  slug: string;
  code: string;
  state: string;
  address: string;
  phone: string;
  email: string;
  managerId?: mongoose.Types.ObjectId;
  programs: mongoose.Types.ObjectId[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
