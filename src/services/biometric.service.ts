import CryptoJS from "crypto-js";
import { logger } from "../utils/logger";
import mongoose from "mongoose";
import { config } from "../config";
import { Applicant } from "../models/applicant.model";
import { ApiError } from "../utils/apiError";

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

const encryptTemplate = (template: string): string =>
  CryptoJS.AES.encrypt(template, config.security.ENCRYPTION_KEY).toString();

const decryptTemplate = (encrypted: string): string => {
  const bytes = CryptoJS.AES.decrypt(encrypted, config.security.ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

/**
 * Enroll a fingerprint template for an applicant.
 * Called from admin dashboard after in-person capture.
 */
export const enrollBiometric = async (
  applicantId: string,
  centerId: string,
  fingerprintTemplate: string, // base64 template from SDK
): Promise<void> => {
  const applicant =
    await Applicant.findById(applicantId).select("+biometricTemplate");
  if (!applicant) throw new ApiError("Applicant not found.", 404);
  if (applicant.biometricEnrolled) {
    throw new ApiError("Biometric already enrolled for this applicant.", 409);
  }

  const encrypted = encryptTemplate(fingerprintTemplate);

  await Applicant.findByIdAndUpdate(applicantId, {
    biometricTemplate: encrypted,
    biometricEnrolled: true,
    biometricEnrolledAt: new Date(),
    biometricCenterId: new mongoose.Types.ObjectId(centerId),
  });

  logger.info(
    `Biometric enrolled for applicant ${applicantId} at center ${centerId}`,
  );
};

/**
 * Verify a presented fingerprint against stored template.
 * Returns true if match, false otherwise.
 *
 * NOTE: Real matching is done by the SDK on the device.
 * This function assumes the SDK has already confirmed a match
 * and we just record the verification event.
 * If the SDK returns a match score, pass it here for logging.
 */
export const verifyBiometric = async (
  applicantId: string,
  matchConfirmed: boolean, // result from SDK match on device
  matchScore?: number,
): Promise<boolean> => {
  const applicant = await Applicant.findById(applicantId);
  if (!applicant) throw new ApiError("Applicant not found.", 404);
  if (!applicant.biometricEnrolled) {
    throw new ApiError(
      "No biometric template enrolled for this applicant.",
      400,
    );
  }

  logger.info(
    `Biometric verification for ${applicantId}: ${matchConfirmed ? "MATCH" : "NO MATCH"}${matchScore ? ` (score: ${matchScore})` : ""}`,
  );

  return matchConfirmed;
};

/**
 * Get enrollment status for display in admin dashboard.
 */
export const getBiometricStatus = async (applicantId: string) => {
  const applicant = await Applicant.findById(applicantId)
    .populate("biometricCenterId", "name")
    .select("biometricEnrolled biometricEnrolledAt biometricCenterId fullName");

  if (!applicant) throw new ApiError("Applicant not found.", 404);

  return {
    enrolled: applicant.biometricEnrolled,
    enrolledAt: applicant.biometricEnrolledAt,
    center: applicant.biometricCenterId,
    applicantName: applicant.fullName,
  };
};
