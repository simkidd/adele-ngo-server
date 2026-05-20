import { Document, Types } from "mongoose";

export interface INinData {
  legalName: string;
  dob: string;
  gender: string;
  stateOfOrigin: string;
  photoUrl?: string;
}

export interface IApplicant extends Document {
  // Account
  email: string;
  password: string;
  refreshToken?: string;

  // Personal — from NIMC + applicant
  fullName: string;
  dob: Date;
  gender: "Male" | "Female";
  phone: string;
  whatsapp?: string;
  stateOfOrigin: string;
  lga: string;
  address: string;
  passportPhoto?: string;

  // NIN
  nin: string; // encrypted at rest
  ninVerified: boolean;
  ninVerifiedAt?: Date;
  ninData?: INinData;

  // Biometric
  biometricEnrolled: boolean;
  biometricTemplate?: string; // encrypted fingerprint template
  biometricEnrolledAt?: Date;
  biometricCenterId?: Types.ObjectId;

  // Meta
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
