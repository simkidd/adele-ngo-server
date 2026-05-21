"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pendingBiometrics = exports.status = exports.verify = exports.enroll = void 0;
const biometric_service_1 = require("../services/biometric.service");
const registration_model_1 = require("../models/registration.model");
const apiResponse_1 = require("../utils/apiResponse");
const apiError_1 = require("../utils/apiError");
// Enroll fingerprint — called after in-person capture at center
const enroll = async (req, res) => {
    const { applicantId, fingerprintTemplate } = req.body;
    if (!applicantId || !fingerprintTemplate) {
        throw new apiError_1.ApiError("applicantId and fingerprintTemplate are required.", 400);
    }
    await (0, biometric_service_1.enrollBiometric)(applicantId, req.user.centerId.toString(), fingerprintTemplate);
    // Update registration status to Verified
    await registration_model_1.Registration.findOneAndUpdate({ applicantId, status: "Accepted" }, { status: "Verified" }, { sort: "-createdAt" });
    (0, apiResponse_1.sendSuccess)(res, null, "Biometric enrolled and applicant verified");
};
exports.enroll = enroll;
// Verify fingerprint match — called from biometric device SDK result
const verify = async (req, res) => {
    const { applicantId, matchConfirmed, matchScore } = req.body;
    const result = await (0, biometric_service_1.verifyBiometric)(applicantId, matchConfirmed, matchScore);
    (0, apiResponse_1.sendSuccess)(res, { matched: result });
};
exports.verify = verify;
// Get biometric status — for admin biometric queue
const status = async (req, res) => {
    const { applicantId } = req.params;
    const data = await (0, biometric_service_1.getBiometricStatus)(applicantId);
    (0, apiResponse_1.sendSuccess)(res, data);
};
exports.status = status;
// List pending biometric verifications for a center
const pendingBiometrics = async (req, res) => {
    const centerId = String(req.query.centerId ?? req.user.centerId);
    if (!centerId)
        throw new apiError_1.ApiError("centerId is required.", 400);
    const registrations = await registration_model_1.Registration.find({
        centerId,
        status: "Accepted",
    })
        .populate("applicantId", "fullName email phone biometricEnrolled passportPhoto")
        .populate("programId", "title")
        .sort("-verificationDeadline");
    const withBiometricStatus = registrations.map((reg) => {
        const applicant = reg.applicantId;
        return {
            registrationId: reg._id,
            applicantId: applicant._id,
            applicantName: applicant.fullName,
            applicantEmail: applicant.email,
            applicantPhone: applicant.phone,
            passportPhoto: applicant.passportPhoto,
            biometricEnrolled: applicant.biometricEnrolled,
            program: reg.programId?.title,
            referenceNumber: reg.referenceNumber,
            verificationDeadline: reg.verificationDeadline,
            daysRemaining: reg.verificationDeadline
                ? Math.ceil((reg.verificationDeadline.getTime() - Date.now()) /
                    (1000 * 60 * 60 * 24))
                : null,
        };
    });
    (0, apiResponse_1.sendSuccess)(res, withBiometricStatus);
};
exports.pendingBiometrics = pendingBiometrics;
//# sourceMappingURL=biometric.controller.js.map