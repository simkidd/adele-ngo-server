import { Document, Types } from "mongoose";

export type AdminRole = "super_admin" | "program_officer" | "blog_editor";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  role: AdminRole;
  centerId?: Types.ObjectId;
  refreshToken?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
