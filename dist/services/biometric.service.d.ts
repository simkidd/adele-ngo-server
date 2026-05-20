import mongoose from "mongoose";
/**
 * Enroll a fingerprint template for an applicant.
 * Called from admin dashboard after in-person capture.
 */
export declare const enrollBiometric: (applicantId: string, centerId: string, fingerprintTemplate: string) => Promise<void>;
/**
 * Verify a presented fingerprint against stored template.
 * Returns true if match, false otherwise.
 *
 * NOTE: Real matching is done by the SDK on the device.
 * This function assumes the SDK has already confirmed a match
 * and we just record the verification event.
 * If the SDK returns a match score, pass it here for logging.
 */
export declare const verifyBiometric: (applicantId: string, matchConfirmed: boolean, // result from SDK match on device
matchScore?: number) => Promise<boolean>;
/**
 * Get enrollment status for display in admin dashboard.
 */
export declare const getBiometricStatus: (applicantId: string) => Promise<{
    enrolled: boolean;
    enrolledAt: Date | undefined;
    center: mongoose.Types.ObjectId | undefined;
    applicantName: string;
}>;
//# sourceMappingURL=biometric.service.d.ts.map