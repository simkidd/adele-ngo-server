import mongoose, { Document } from "mongoose";

export type ProgramCategory =
  | "Construction & Civil Works"
  | "Fabrication & Metalwork"
  | "Woodwork & Furniture"
  | "Automotive & Mechanical"
  | "Technology & Networks"
  | "Media & Communications"
  | "Agriculture"
  | "Fashion & Beauty"
  | "Hospitality";

export interface IProgram extends Document {
  title: string;
  slug: string;
  category: ProgramCategory;
  description: string;
  objectives: string[];
  outcomes: string[];
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
