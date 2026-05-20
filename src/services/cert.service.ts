import { cloudinary } from "../config/cloudinary";
import { sendCertificateIssued } from "./mail.service";
import { logger } from "../utils/logger";
import mongoose from "mongoose";
import { Applicant } from "../models/applicant.model";
import { Center } from "../models/center.model";
import { Cohort } from "../models/cohort.model";
import { Program } from "../models/program.model";
import { Registration } from "../models/registration.model";
import { Certificate } from "../models/certificate.model";
import { ApiError } from "../utils/apiError";
import { generateCertId } from "../utils/generateRefNumber";
import { generateQrBuffer, generateQrDataUrl } from "./qr.service";
import { generateCertificatePdf } from "./pdf.service";

export const issueCertificate = async (
  registrationId: string,
  issuedById: string,
): Promise<InstanceType<typeof Certificate>> => {
  // 1. Validate registration
  const registration = await Registration.findById(registrationId);
  if (!registration) throw new ApiError("Registration not found.", 404);
  if (registration.status !== "Enrolled") {
    throw new ApiError(
      "Certificate can only be issued for enrolled participants.",
      400,
    );
  }

  // 2. Check no existing cert
  const existing = await Certificate.findOne({ registrationId });
  if (existing)
    throw new ApiError(
      "Certificate already issued for this registration.",
      409,
    );

  // 3. Load related data
  const [applicant, program, cohort, center] = await Promise.all([
    Applicant.findById(registration.applicantId),
    Program.findById(registration.programId),
    Cohort.findById(registration.cohortId),
    Center.findById(registration.centerId),
  ]);

  if (!applicant || !program || !cohort || !center) {
    throw new ApiError("Related records not found.", 404);
  }

  // 4. Generate cert ID
  const certId = await generateCertId(center.code, program.title);

  // 5. Generate QR code
  const qrDataUrl = await generateQrDataUrl(certId);
  const qrBuffer = await generateQrBuffer(certId);

  // 6. Format dates
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  // 7. Generate PDF
  const pdfBuffer = await generateCertificatePdf({
    certId,
    graduateName: applicant.fullName.toUpperCase(),
    programTitle: program.title,
    centerName: center.name,
    cohortName: cohort.name,
    trainingStart: fmt(cohort.startDate),
    trainingEnd: fmt(cohort.endDate),
    issueDate: fmt(new Date()),
    qrDataUrl,
  });

  // 8. Upload QR to Cloudinary
  const qrUpload = await new Promise<{ secure_url: string; public_id: string }>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "adele-foundation/qrcodes",
            public_id: certId,
            format: "png",
          },
          (error, result) => {
            if (error || !result)
              return reject(error ?? new Error("QR upload failed"));
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          },
        )
        .end(qrBuffer);
    },
  );

  // 9. Upload PDF to Cloudinary
  const pdfUpload = await new Promise<{
    secure_url: string;
    public_id: string;
  }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "adele-foundation/certificates",
          public_id: certId,
          resource_type: "raw",
          format: "pdf",
        },
        (error, result) => {
          if (error || !result)
            return reject(error ?? new Error("PDF upload failed"));
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        },
      )
      .end(pdfBuffer);
  });

  // 10. Save certificate to DB
  const certificate = await Certificate.create({
    certId,
    registrationId: new mongoose.Types.ObjectId(registrationId),
    applicantId: applicant._id,
    graduateName: applicant.fullName,
    programId: program._id,
    programTitle: program.title,
    centerId: center._id,
    centerName: center.name,
    cohortId: cohort._id,
    cohortName: cohort.name,
    trainingStart: cohort.startDate,
    trainingEnd: cohort.endDate,
    issueDate: new Date(),
    issuedBy: new mongoose.Types.ObjectId(issuedById),
    pdfUrl: pdfUpload.secure_url,
    pdfPublicId: pdfUpload.public_id,
    qrCodeUrl: qrUpload.secure_url,
    qrPublicId: qrUpload.public_id,
  });

  // 11. Send email with PDF attached
  await sendCertificateIssued(
    applicant.email,
    applicant.fullName,
    program.title,
    certId,
    pdfUpload.secure_url,
    pdfBuffer,
  );

  logger.info(`Certificate issued: ${certId} for ${applicant.fullName}`);
  return certificate;
};
