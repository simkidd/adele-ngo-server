import { Document, Types } from "mongoose";

export type RegistrationStatus =
  | "Pending"
  | "Accepted"
  | "Verified"
  | "Enrolled"
  | "Rejected";

export type Qualification =
  | "No formal education"
  | "Primary School"
  | "Junior Secondary (JSS)"
  | "Senior Secondary (SSCE/WAEC/NECO)"
  | "OND / NCE"
  | "HND / B.Sc and above"
  | "Vocational/Technical Certificate";

export type EmploymentStatus =
  | "Unemployed"
  | "Self-employed (informal)"
  | "Employed part-time"
  | "Employed full-time"
  | "Student";

export type PriorExperience =
  | "None"
  | "Basic / Self-taught"
  | "Intermediate"
  | "Advanced";

export type PostTrainingPlan =
  | "Get employment in the field"
  | "Start my own business"
  | "Upgrade existing skills"
  | "Other";

export type ReferralSource =
  | "Social media"
  | "Friend or family referral"
  | "Community announcement"
  | "School or institution"
  | "Government agency"
  | "Other";

export interface IRegistration extends Document {
  applicantId: Types.ObjectId;
  cohortId: Types.ObjectId;
  centerId: Types.ObjectId;
  programId: Types.ObjectId;
  secondChoiceId?: Types.ObjectId;

  // Background
  qualification: Qualification;
  employmentStatus: EmploymentStatus;
  priorExperience: PriorExperience;
  experienceDetail?: string;

  // Motivation
  motivation: string;
  postTrainingPlan: PostTrainingPlan;
  referralSource: ReferralSource;

  // Supporting
  specialNeeds?: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;

  // State
  referenceNumber: string;
  status: RegistrationStatus;
  verificationDeadline?: Date;
  reviewedBy?: Types.ObjectId;
  adminNotes?: string;

  appliedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
