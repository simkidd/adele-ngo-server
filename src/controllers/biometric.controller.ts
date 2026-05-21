import { Request, Response } from "express";
import {
  enrollBiometric,
  verifyBiometric,
  getBiometricStatus,
} from "../services/biometric.service";
import { Registration } from "../models/registration.model";
import { sendSuccess } from "../utils/apiResponse";
import { ApiError } from "../utils/apiError";

// Enroll fingerprint — called after in-person capture at center
export const enroll = async (req: Request, res: Response): Promise<void> => {
  const { applicantId, fingerprintTemplate } = req.body;
  if (!applicantId || !fingerprintTemplate) {
    throw new ApiError(
      "applicantId and fingerprintTemplate are required.",
      400,
    );
  }

  await enrollBiometric(
    applicantId,
    req.user!.centerId!.toString(),
    fingerprintTemplate,
  );

  // Update registration status to Verified
  await Registration.findOneAndUpdate(
    { applicantId, status: "Accepted" },
    { status: "Verified" },
    { sort: "-createdAt" },
  );

  sendSuccess(res, null, "Biometric enrolled and applicant verified");
};

// Verify fingerprint match — called from biometric device SDK result
export const verify = async (req: Request, res: Response): Promise<void> => {
  const { applicantId, matchConfirmed, matchScore } = req.body;
  const result = await verifyBiometric(applicantId, matchConfirmed, matchScore);
  sendSuccess(res, { matched: result });
};

// Get biometric status — for admin biometric queue
export const status = async (req: Request, res: Response): Promise<void> => {
  const { applicantId } = req.params as { applicantId: string };

  const data = await getBiometricStatus(applicantId);
  sendSuccess(res, data);
};

// List pending biometric verifications for a center
export const pendingBiometrics = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const centerId = String(req.query.centerId ?? req.user!.centerId);
  if (!centerId) throw new ApiError("centerId is required.", 400);

  const registrations = await Registration.find({
    centerId,
    status: "Accepted",
  })
    .populate(
      "applicantId",
      "fullName email phone biometricEnrolled passportPhoto",
    )
    .populate("programId", "title")
    .sort("-verificationDeadline");

  const withBiometricStatus = registrations.map((reg) => {
    const applicant = reg.applicantId as unknown as {
      fullName: string;
      email: string;
      phone: string;
      biometricEnrolled: boolean;
      passportPhoto: string;
      _id: string;
    };
    return {
      registrationId: reg._id,
      applicantId: applicant._id,
      applicantName: applicant.fullName,
      applicantEmail: applicant.email,
      applicantPhone: applicant.phone,
      passportPhoto: applicant.passportPhoto,
      biometricEnrolled: applicant.biometricEnrolled,
      program: (reg.programId as unknown as { title: string })?.title,
      referenceNumber: reg.referenceNumber,
      verificationDeadline: reg.verificationDeadline,
      daysRemaining: reg.verificationDeadline
        ? Math.ceil(
            (reg.verificationDeadline.getTime() - Date.now()) /
              (1000 * 60 * 60 * 24),
          )
        : null,
    };
  });

  sendSuccess(res, withBiometricStatus);
};
