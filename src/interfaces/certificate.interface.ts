import mongoose, { Document } from "mongoose";

export interface ICertificate extends Document {
  certId: string;
  registrationId: mongoose.Types.ObjectId;
  applicantId: mongoose.Types.ObjectId;
  graduateName: string;
  programId: mongoose.Types.ObjectId;
  programTitle: string;
  centerId: mongoose.Types.ObjectId;
  centerName: string;
  cohortId: mongoose.Types.ObjectId;
  cohortName: string;
  trainingStart: Date;
  trainingEnd: Date;
  issueDate: Date;
  issuedBy: mongoose.Types.ObjectId;
  pdfUrl: string;
  pdfPublicId: string;
  qrCodeUrl: string;
  qrPublicId: string;
  createdAt: Date;
}
