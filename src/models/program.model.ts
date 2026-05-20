import mongoose, { Schema } from "mongoose";
import { IProgram } from "../interfaces/program.interface";

const programSchema = new Schema<IProgram>(
  {
    title: { type: String, required: true, trim: true, unique: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Construction & Civil Works",
        "Fabrication & Metalwork",
        "Woodwork & Furniture",
        "Automotive & Mechanical",
        "Technology & Networks",
        "Media & Communications",
        "Agriculture",
        "Fashion & Beauty",
        "Hospitality",
      ],
    },
    description: { type: String, required: true },
    objectives: [{ type: String }],
    outcomes: [{ type: String }],
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

programSchema.index({ title: "text", category: 1 });

export const Program = mongoose.model<IProgram>("Program", programSchema);
