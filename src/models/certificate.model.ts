import mongoose, { Schema } from "mongoose";
import { ICertificate } from "../interfaces/certificate.interface";

const certificateSchema = new Schema<ICertificate>(
  {
    certId: { type: String, required: true, unique: true, index: true },
    registrationId: {
      type: Schema.Types.ObjectId,
      ref: "Registration",
      required: true,
      unique: true,
    },
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: "Applicant",
      required: true,
    },
    graduateName: { type: String, required: true },
    programId: { type: Schema.Types.ObjectId, ref: "Program", required: true },
    programTitle: { type: String, required: true },
    centerId: { type: Schema.Types.ObjectId, ref: "Center", required: true },
    centerName: { type: String, required: true },
    cohortId: { type: Schema.Types.ObjectId, ref: "Cohort", required: true },
    cohortName: { type: String, required: true },
    trainingStart: { type: Date, required: true },
    trainingEnd: { type: Date, required: true },
    issueDate: { type: Date, required: true, default: Date.now },
    issuedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    pdfUrl: { type: String, required: true },
    pdfPublicId: { type: String, required: true },
    qrCodeUrl: { type: String, required: true },
    qrPublicId: { type: String, required: true },
  },
  { timestamps: true },
);

export const Certificate = mongoose.model<ICertificate>(
  "Certificate",
  certificateSchema,
);
