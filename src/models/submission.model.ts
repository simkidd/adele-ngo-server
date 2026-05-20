import mongoose, { Schema } from "mongoose";
import { ISubmission } from "../interfaces/submission.interface";

const submissionSchema = new Schema<ISubmission>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String },
    enquiryType: {
      type: String,
      required: true,
      enum: ["application", "volunteer", "general"],
    },
    program: { type: String },
    message: { type: String, required: true, maxlength: 2000 },
    read: { type: Boolean, default: false },
    readBy: { type: Schema.Types.ObjectId, ref: "User" },
    readAt: { type: Date },
  },
  { timestamps: true },
);

export const Submission = mongoose.model<ISubmission>(
  "Submission",
  submissionSchema,
);
