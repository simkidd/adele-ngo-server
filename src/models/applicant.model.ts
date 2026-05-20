import mongoose, { Schema } from "mongoose";
import { IApplicant } from "../interfaces/applicant.interface";

const applicantSchema = new Schema<IApplicant>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 8, select: false },
    refreshToken: { type: String, select: false },

    fullName: { type: String, required: true, trim: true },
    dob: { type: Date, required: true },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Prefer not to say"],
    },
    phone: { type: String, required: true, trim: true },
    whatsapp: { type: String, trim: true },
    stateOfOrigin: { type: String, required: true },
    lga: { type: String, required: true },
    address: { type: String, required: true },
    passportPhoto: { type: String },

    nin: { type: String, required: true, select: false },
    ninVerified: { type: Boolean, default: false },
    ninVerifiedAt: { type: Date },
    ninData: { type: Schema.Types.Mixed },

    biometricEnrolled: { type: Boolean, default: false },
    biometricTemplate: { type: String, select: false },
    biometricEnrolledAt: { type: Date },
    biometricCenterId: { type: Schema.Types.ObjectId, ref: "Center" },

    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { timestamps: true },
);

applicantSchema.index({ email: 1 });

export const Applicant = mongoose.model<IApplicant>(
  "Applicant",
  applicantSchema,
);
