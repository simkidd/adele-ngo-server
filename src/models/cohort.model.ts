import mongoose, { Schema } from "mongoose";
import {
  ICohortProgram,
  ICenterCohort,
  ICohort,
} from "../interfaces/cohort.interface";

const cohortProgramSchema = new Schema<ICohortProgram>(
  {
    programId: { type: Schema.Types.ObjectId, ref: "Program", required: true },
    totalSeats: { type: Number, required: true, min: 1 },
    enrolledCount: { type: Number, default: 0, min: 0 },
  },
  { _id: false },
);

const centerCohortSchema = new Schema<ICenterCohort>(
  {
    centerId: { type: Schema.Types.ObjectId, ref: "Center", required: true },
    programs: [cohortProgramSchema],
  },
  { _id: false },
);

const cohortSchema = new Schema<ICohort>(
  {
    name: { type: String, required: true, trim: true },
    applicationStart: { type: Date, required: true },
    applicationEnd: { type: Date, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Draft", "Open", "Closed", "Active", "Completed"],
      default: "Draft",
    },
    centers: [centerCohortSchema],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    publishedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true },
);

// Only one cohort can be Open or Active at a time — enforced at service level
cohortSchema.index({ status: 1 });

export const Cohort = mongoose.model<ICohort>("Cohort", cohortSchema);
