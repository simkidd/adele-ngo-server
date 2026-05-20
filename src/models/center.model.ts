import mongoose, { Schema } from "mongoose";
import { ICenter } from "../interfaces/center.interface";

const centerSchema = new Schema<ICenter>(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      enum: ["port-harcourt", "bayelsa"],
    },
    code: { type: String, required: true, unique: true, enum: ["PH", "BY"] },

    state: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    managerId: { type: Schema.Types.ObjectId, ref: "User" },
    programs: [{ type: Schema.Types.ObjectId, ref: "Program" }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Center = mongoose.model<ICenter>("Center", centerSchema);
