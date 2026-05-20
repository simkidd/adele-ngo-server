import mongoose, { Document } from "mongoose";

export type EnquiryType = "application" | "volunteer" | "general";

export interface ISubmission extends Document {
  name: string;
  email: string;
  phone?: string;
  enquiryType: EnquiryType;
  program?: string;
  message: string;
  read: boolean;
  readBy?: mongoose.Types.ObjectId;
  readAt?: Date;
  createdAt: Date;
}
