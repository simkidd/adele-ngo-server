"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.issueCertificate = void 0;
const cloudinary_1 = require("../config/cloudinary");
const mail_service_1 = require("./mail.service");
const logger_1 = require("../utils/logger");
const mongoose_1 = __importDefault(require("mongoose"));
const applicant_model_1 = require("../models/applicant.model");
const center_model_1 = require("../models/center.model");
const cohort_model_1 = require("../models/cohort.model");
const program_model_1 = require("../models/program.model");
const registration_model_1 = require("../models/registration.model");
const certificate_model_1 = require("../models/certificate.model");
const apiError_1 = require("../utils/apiError");
const generateRefNumber_1 = require("../utils/generateRefNumber");
const qr_service_1 = require("./qr.service");
const pdf_service_1 = require("./pdf.service");
const issueCertificate = async (registrationId, issuedById) => {
    // 1. Validate registration
    const registration = await registration_model_1.Registration.findById(registrationId);
    if (!registration)
        throw new apiError_1.ApiError("Registration not found.", 404);
    if (registration.status !== "Enrolled") {
        throw new apiError_1.ApiError("Certificate can only be issued for enrolled participants.", 400);
    }
    // 2. Check no existing cert
    const existing = await certificate_model_1.Certificate.findOne({ registrationId });
    if (existing)
        throw new apiError_1.ApiError("Certificate already issued for this registration.", 409);
    // 3. Load related data
    const [applicant, program, cohort, center] = await Promise.all([
        applicant_model_1.Applicant.findById(registration.applicantId),
        program_model_1.Program.findById(registration.programId),
        cohort_model_1.Cohort.findById(registration.cohortId),
        center_model_1.Center.findById(registration.centerId),
    ]);
    if (!applicant || !program || !cohort || !center) {
        throw new apiError_1.ApiError("Related records not found.", 404);
    }
    // 4. Generate cert ID
    const certId = await (0, generateRefNumber_1.generateCertId)(center.code, program.title);
    // 5. Generate QR code
    const qrDataUrl = await (0, qr_service_1.generateQrDataUrl)(certId);
    const qrBuffer = await (0, qr_service_1.generateQrBuffer)(certId);
    // 6. Format dates
    const fmt = (d) => d.toLocaleDateString("en-NG", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    // 7. Generate PDF
    const pdfBuffer = await (0, pdf_service_1.generateCertificatePdf)({
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
    const qrUpload = await new Promise((resolve, reject) => {
        cloudinary_1.cloudinary.uploader
            .upload_stream({
            folder: "adele-foundation/qrcodes",
            public_id: certId,
            format: "png",
        }, (error, result) => {
            if (error || !result)
                return reject(error ?? new Error("QR upload failed"));
            resolve({
                secure_url: result.secure_url,
                public_id: result.public_id,
            });
        })
            .end(qrBuffer);
    });
    // 9. Upload PDF to Cloudinary
    const pdfUpload = await new Promise((resolve, reject) => {
        cloudinary_1.cloudinary.uploader
            .upload_stream({
            folder: "adele-foundation/certificates",
            public_id: certId,
            resource_type: "raw",
            format: "pdf",
        }, (error, result) => {
            if (error || !result)
                return reject(error ?? new Error("PDF upload failed"));
            resolve({
                secure_url: result.secure_url,
                public_id: result.public_id,
            });
        })
            .end(pdfBuffer);
    });
    // 10. Save certificate to DB
    const certificate = await certificate_model_1.Certificate.create({
        certId,
        registrationId: new mongoose_1.default.Types.ObjectId(registrationId),
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
        issuedBy: new mongoose_1.default.Types.ObjectId(issuedById),
        pdfUrl: pdfUpload.secure_url,
        pdfPublicId: pdfUpload.public_id,
        qrCodeUrl: qrUpload.secure_url,
        qrPublicId: qrUpload.public_id,
    });
    // 11. Send email with PDF attached
    await (0, mail_service_1.sendCertificateIssued)(applicant.email, applicant.fullName, program.title, certId, pdfUpload.secure_url, pdfBuffer);
    logger_1.logger.info(`Certificate issued: ${certId} for ${applicant.fullName}`);
    return certificate;
};
exports.issueCertificate = issueCertificate;
//# sourceMappingURL=cert.service.js.map