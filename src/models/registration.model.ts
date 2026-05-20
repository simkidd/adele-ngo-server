import mongoose, { Schema } from "mongoose";
import { IRegistration } from "../interfaces/registration.interface";

const registrationSchema = new Schema<IRegistration>(
  {
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: "Applicant",
      required: true,
    },
    cohortId: { type: Schema.Types.ObjectId, ref: "Cohort", required: true },
    centerId: { type: Schema.Types.ObjectId, ref: "Center", required: true },
    programId: { type: Schema.Types.ObjectId, ref: "Program", required: true },
    secondChoiceId: { type: Schema.Types.ObjectId, ref: "Program" },

    qualification: { type: String, required: true },
    employmentStatus: { type: String, required: true },
    priorExperience: { type: String, required: true },
    experienceDetail: { type: String },

    motivation: { type: String, required: true, minlength: 50 },
    postTrainingPlan: { type: String, required: true },
    referralSource: { type: String, required: true },

    specialNeeds: { type: String },
    emergencyName: { type: String, required: true },
    emergencyPhone: { type: String, required: true },
    emergencyRelation: { type: String, required: true },

    referenceNumber: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Verified", "Enrolled", "Rejected"],
      default: "Pending",
    },
    verificationDeadline: { type: Date },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    adminNotes: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Compound index: one application per applicant per cohort
registrationSchema.index({ applicantId: 1, cohortId: 1 }, { unique: true });
registrationSchema.index({ centerId: 1, status: 1 });
registrationSchema.index({ programId: 1, cohortId: 1 });
registrationSchema.index({ referenceNumber: 1 });

// Virtuals
registrationSchema.virtual("applicant", {
  ref: "Applicant",
  localField: "applicantId",
  foreignField: "_id",
  justOne: true,
});

registrationSchema.virtual("appliedAt").get(function () {
  return this.createdAt;
});

export const Registration = mongoose.model<IRegistration>(
  "Registration",
  registrationSchema,
);
