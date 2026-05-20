"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBiometricStatus = exports.verifyBiometric = exports.enrollBiometric = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const logger_1 = require("../utils/logger");
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config");
const applicant_model_1 = require("../models/applicant.model");
const apiError_1 = require("../utils/apiError");
/**
 * Biometric service — device-agnostic layer.
 *
 * The actual fingerprint SDK (SecuGen, Futronic, etc.) is
 * integrated at the client/admin-frontend level. The device
 * captures the fingerprint and sends the resulting template
 * (base64 string) to these endpoints.
 *
 * This service handles:
 *   - Encrypting and storing the template
 *   - Marking the applicant as biometric-enrolled
 *   - Matching a presented template against stored
 */
const encryptTemplate = (template) => crypto_js_1.default.AES.encrypt(template, config_1.config.security.ENCRYPTION_KEY).toString();
const decryptTemplate = (encrypted) => {
    const bytes = crypto_js_1.default.AES.decrypt(encrypted, config_1.config.security.ENCRYPTION_KEY);
    return bytes.toString(crypto_js_1.default.enc.Utf8);
};
/**
 * Enroll a fingerprint template for an applicant.
 * Called from admin dashboard after in-person capture.
 */
const enrollBiometric = async (applicantId, centerId, fingerprintTemplate) => {
    const applicant = await applicant_model_1.Applicant.findById(applicantId).select("+biometricTemplate");
    if (!applicant)
        throw new apiError_1.ApiError("Applicant not found.", 404);
    if (applicant.biometricEnrolled) {
        throw new apiError_1.ApiError("Biometric already enrolled for this applicant.", 409);
    }
    const encrypted = encryptTemplate(fingerprintTemplate);
    await applicant_model_1.Applicant.findByIdAndUpdate(applicantId, {
        biometricTemplate: encrypted,
        biometricEnrolled: true,
        biometricEnrolledAt: new Date(),
        biometricCenterId: new mongoose_1.default.Types.ObjectId(centerId),
    });
    logger_1.logger.info(`Biometric enrolled for applicant ${applicantId} at center ${centerId}`);
};
exports.enrollBiometric = enrollBiometric;
/**
 * Verify a presented fingerprint against stored template.
 * Returns true if match, false otherwise.
 *
 * NOTE: Real matching is done by the SDK on the device.
 * This function assumes the SDK has already confirmed a match
 * and we just record the verification event.
 * If the SDK returns a match score, pass it here for logging.
 */
const verifyBiometric = async (applicantId, matchConfirmed, // result from SDK match on device
matchScore) => {
    const applicant = await applicant_model_1.Applicant.findById(applicantId);
    if (!applicant)
        throw new apiError_1.ApiError("Applicant not found.", 404);
    if (!applicant.biometricEnrolled) {
        throw new apiError_1.ApiError("No biometric template enrolled for this applicant.", 400);
    }
    logger_1.logger.info(`Biometric verification for ${applicantId}: ${matchConfirmed ? "MATCH" : "NO MATCH"}${matchScore ? ` (score: ${matchScore})` : ""}`);
    return matchConfirmed;
};
exports.verifyBiometric = verifyBiometric;
/**
 * Get enrollment status for display in admin dashboard.
 */
const getBiometricStatus = async (applicantId) => {
    const applicant = await applicant_model_1.Applicant.findById(applicantId)
        .populate("biometricCenterId", "name")
        .select("biometricEnrolled biometricEnrolledAt biometricCenterId fullName");
    if (!applicant)
        throw new apiError_1.ApiError("Applicant not found.", 404);
    return {
        enrolled: applicant.biometricEnrolled,
        enrolledAt: applicant.biometricEnrolledAt,
        center: applicant.biometricCenterId,
        applicantName: applicant.fullName,
    };
};
exports.getBiometricStatus = getBiometricStatus;
//# sourceMappingURL=biometric.service.js.map