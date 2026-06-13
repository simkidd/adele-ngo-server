import { Request, Response } from "express";
import { generateRefNumber } from "../utils/generateRefNumber";
import {
  sendApplicationConfirmation,
  sendAdminRegistrationAlert,
} from "../services/mail.service";
import { config } from "../config";
import { Announcement } from "../models/announcement.model";
import { Applicant } from "../models/applicant.model";
import { Center } from "../models/center.model";
import { Cohort } from "../models/cohort.model";
import { Program } from "../models/program.model";
import { Registration } from "../models/registration.model";
import User from "../models/user.model";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../services/token.service";
import { sendSuccess, sendError } from "../utils/apiResponse";
import { comparePassword, hashPassword } from "../utils/auth";
import { Certificate } from "../models/certificate.model";
import { AnnouncementAudience } from "../interfaces/annoucement.interface";

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.app.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ── Register (new account + first application) ───────────────────────────────
export const registerApplicant = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const {
    // Step 1 — from NIMC
    nin,
    fullName,
    dob,
    gender,
    stateOfOrigin,
    // Step 2
    phone,
    whatsapp,
    email,
    lga,
    address,
    // Step 3
    centerId,
    programId,
    secondChoiceId,
    // Step 4
    qualification,
    employmentStatus,
    priorExperience,
    experienceDetail,
    // Step 5
    motivation,
    postTrainingPlan,
    referralSource,
    // Step 6
    specialNeeds,
    emergencyName,
    emergencyPhone,
    emergencyRelation,
    // Step 7
    password: pw,
    // passport photo URL (from Cloudinary upload before form submit)
    passportPhoto,
  } = req.body;

  // Check email uniqueness
  const emailExists = await Applicant.findOne({ email });
  if (emailExists) {
    sendError(
      res,
      "An account with this email already exists. Please log in.",
      409,
    );
    return;
  }

  // Verify open cohort exists
  const openCohort = await Cohort.findOne({ status: "Open" });
  if (!openCohort) {
    sendError(
      res,
      "Applications are currently closed. No open cohort found.",
      400,
    );
    return;
  }

  // Validate center + program are in open cohort
  const centerConfig = openCohort.centers.find(
    (c) => c.centerId.toString() === centerId,
  );
  if (!centerConfig) {
    sendError(
      res,
      "Selected center is not available in the current cohort.",
      400,
    );
    return;
  }

  const programConfig = centerConfig.programs.find(
    (p) => p.programId.toString() === programId,
  );
  if (!programConfig) {
    sendError(
      res,
      "Selected program is not available at this center in the current cohort.",
      400,
    );
    return;
  }

  // Check seat availability
  if (programConfig.enrolledCount >= programConfig.totalSeats) {
    sendError(
      res,
      "This program is full. Please select another program or center.",
      400,
    );
    return;
  }

  // Get center code for ref number
  const center = await Center.findById(centerId);
  if (!center) {
    sendError(res, "Center not found.", 404);
    return;
  }

  // Create applicant account
  const applicant = await Applicant.create({
    email,
    password: await hashPassword(pw),
    fullName,
    dob: new Date(dob),
    gender,
    phone,
    whatsapp,
    stateOfOrigin,
    lga,
    address,
    passportPhoto: passportPhoto ?? "",
    nin,
  });

  // Generate reference number
  const referenceNumber = await generateRefNumber(center.code);

  // Create registration
  const registration = await Registration.create({
    applicantId: applicant._id,
    cohortId: openCohort._id,
    centerId,
    programId,
    secondChoiceId: secondChoiceId || undefined,
    qualification,
    employmentStatus,
    priorExperience,
    experienceDetail,
    motivation,
    postTrainingPlan,
    referralSource,
    specialNeeds,
    emergencyName,
    emergencyPhone,
    emergencyRelation,
    referenceNumber,
    status: "Pending",
  });

  // Issue tokens
  const accessToken = generateAccessToken(applicant.id, "applicant");
  const refreshToken = generateRefreshToken(applicant.id, "applicant");
  applicant.refreshToken = refreshToken;
  applicant.lastLogin = new Date();
  await applicant.save({ validateBeforeSave: false });

  res.cookie("applicantRefreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

  // Send emails (non-blocking)
  const program = await Program.findById(programId);
  sendApplicationConfirmation(
    email,
    fullName,
    referenceNumber,
    program?.title ?? "",
    center.name,
  );

  // Alert all super_admins + center program officers
  const admins = await User.find({
    $or: [{ role: "super_admin" }, { role: "program_officer", centerId }],
    isActive: true,
  });
  admins.forEach((admin) => {
    sendAdminRegistrationAlert(
      admin.email,
      fullName,
      program?.title ?? "",
      center.name,
      referenceNumber,
    );
  });

  sendSuccess(
    res,
    {
      accessToken,
      applicant: {
        id: applicant.id,
        fullName: applicant.fullName,
        email: applicant.email,
      },
      referenceNumber,
    },
    "Application submitted successfully",
    201,
  );
};

// ── Applicant login ───────────────────────────────────────────────────────────
export const loginApplicant = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { email, password } = req.body;

  const applicant = await Applicant.findOne({ email, isActive: true }).select(
    "+password",
  );
  if (!applicant || !(await comparePassword(password, applicant.password))) {
    sendError(res, "Invalid email or password", 401);
    return;
  }

  const accessToken = generateAccessToken(applicant.id, "applicant");
  const refreshToken = generateRefreshToken(applicant.id, "applicant");

  applicant.refreshToken = refreshToken;
  applicant.lastLogin = new Date();
  await applicant.save({ validateBeforeSave: false });

  res.cookie("applicantRefreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

  sendSuccess(
    res,
    {
      accessToken,
      applicant: {
        id: applicant.id,
        fullName: applicant.fullName,
        email: applicant.email,
      },
    },
    "Login successful",
  );
};

// ── Refresh token ─────────────────────────────────────────────────────────────
export const refreshApplicantToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const token = req.cookies?.applicantRefreshToken as string | undefined;
  if (!token) {
    sendError(res, "No refresh token", 401);
    return;
  }

  let decoded: { id: string };
  try {
    decoded = verifyRefreshToken(token, "applicant") as { id: string };
  } catch {
    sendError(res, "Invalid refresh token", 401);
    return;
  }

  const applicant = await Applicant.findById(decoded.id).select(
    "+refreshToken",
  );
  if (!applicant || applicant.refreshToken !== token) {
    sendError(res, "Refresh token mismatch", 401);
    return;
  }

  const accessToken = generateAccessToken(applicant.id, "applicant");
  const newRefreshToken = generateRefreshToken(applicant.id, "applicant");
  applicant.refreshToken = newRefreshToken;
  await applicant.save({ validateBeforeSave: false });

  res.cookie("applicantRefreshToken", newRefreshToken, REFRESH_COOKIE_OPTIONS);
  sendSuccess(res, { accessToken }, "Token refreshed");
};

// ── Logout ────────────────────────────────────────────────────────────────────
export const logoutApplicant = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const token = req.cookies?.applicantRefreshToken as string | undefined;
  if (token) {
    await Applicant.findOneAndUpdate(
      { refreshToken: token },
      { refreshToken: null },
    );
  }
  res.clearCookie("applicantRefreshToken");
  sendSuccess(res, null, "Logged out successfully");
};

// ── Dashboard: Get me (profile) ────────────────────────
export const getApplicantMe = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const applicant = req.applicant!;

  sendSuccess(res, {
    id: applicant._id,
    fullName: applicant.fullName,
    email: applicant.email,
    phone: applicant.phone,
    whatsapp: applicant.whatsapp,
    gender: applicant.gender,
    dob: applicant.dob,
    stateOfOrigin: applicant.stateOfOrigin,
    lga: applicant.lga,
    address: applicant.address,
    passportPhoto: applicant.passportPhoto,
    biometricEnrolled: applicant.biometricEnrolled,
    createdAt: applicant.createdAt,
  });
};

// ── Dashboard: Update profile ─────────────────────────────────────────────────
export const updateApplicantProfile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const allowed = ["phone", "whatsapp", "address", "lga", "passportPhoto"];
  const updates: Record<string, unknown> = {};
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const applicant = await Applicant.findByIdAndUpdate(
    req.applicant!._id,
    updates,
    { new: true, runValidators: true },
  );
  sendSuccess(res, applicant, "Profile updated");
};

// ── Dashboard: Change password ────────────────────────────────────────────────
export const changeApplicantPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { currentPassword, newPassword } = req.body;

  const applicant = await Applicant.findById(req.applicant!._id).select(
    "+password",
  );
  if (
    !applicant ||
    !(await comparePassword(currentPassword, applicant.password))
  ) {
    sendError(res, "Current password is incorrect", 401);
    return;
  }

  applicant.password = newPassword;
  await applicant.save();
  sendSuccess(res, null, "Password changed successfully");
};

// ── Dashboard: Get applications ────────────────────────────────────────────
export const getApplicantApplications = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const applicantId = req.applicant!._id;

  const applications = await Registration.find({ applicantId })
    .populate("programId", "title category description")
    .populate("centerId", "name code address")
    .populate(
      "cohortId",
      "name status startDate endDate applicationStart applicationEnd",
    )
    .populate("secondChoiceId", "title")
    .sort("-createdAt");

  const openCohort = await Cohort.findOne({ status: "Open" })
    .populate("centers.centerId", "name")
    .populate("centers.programs.programId", "title");

  let currentRegistration = null;
  let canApply = false;

  if (openCohort) {
    currentRegistration = await Registration.findOne({
      applicantId,
      cohortId: openCohort._id,
    })
      .populate("programId", "title category")
      .populate("centerId", "name code")
      .populate("cohortId", "name status startDate endDate");

    canApply = !currentRegistration;
  }

  sendSuccess(res, {
    applications,
    currentRegistration,
    openCohort,
    canApply,
    total: applications.length,
  });
};

// ── Dashboard: Get application detail ────────────────────────────────────────
export const getApplicantApplication = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const registration = await Registration.findOne({
    _id: String(req.params.id),
    applicantId: req.applicant!._id,
  })
    .populate("programId", "title category description")
    .populate("centerId", "name address phone email")
    .populate("cohortId", "name startDate endDate applicationEnd status")
    .populate("secondChoiceId", "title");

  if (!registration) {
    sendError(res, "Application not found", 404);
    return;
  }

  sendSuccess(res, { registration });
};

// ── Dashboard: Get certificate ────────────────────────────────────────────────
export const getApplicantCertificate = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const certificate = await Certificate.findOne({
    applicantId: req.applicant!._id,
  })
    .populate("programId", "title")
    .populate("centerId", "name")
    .populate("cohortId", "name");

  if (!certificate) {
    sendSuccess(res, { certificate: null });
    return;
  }

  sendSuccess(res, { certificate });
};

// ── Dashboard: Announcements ──────────────────────────────────────────────────
export const getApplicantAnnouncements = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const registration = await Registration.findOne({
    applicantId: req.applicant!._id,
  });

  const audienceFilter: { $in: AnnouncementAudience[] } =
    registration?.status === "Enrolled"
      ? { $in: ["Public", "Applicants", "Enrolled", "All"] }
      : { $in: ["Public", "Applicants", "All"] };

  const announcements = await Announcement.find({
    status: "Published",
    audience: audienceFilter,
  })
    .sort("-publishedAt")
    .limit(20);

  sendSuccess(res, announcements);
};

export const getApplicantDashboard = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const applicantId = req.applicant!._id;

  const registration = await Registration.findOne({
    applicantId,
  })
    .populate("programId", "title category")
    .populate("centerId", "name code address")
    .populate("cohortId", "name startDate endDate status")
    .sort("-createdAt");

  const certificate = registration
    ? await Certificate.findOne({
        registrationId: registration._id,
      })
    : null;

  const audience: AnnouncementAudience[] =
    registration?.status === "Enrolled"
      ? ["Public", "Applicants", "Enrolled", "All"]
      : ["Public", "Applicants", "All"];

  const announcements = await Announcement.find({
    status: "Published",
    audience: { $in: audience },
  })
    .sort("-publishedAt")
    .limit(5);

  sendSuccess(res, {
    registration,
    certificate,
    announcements,
  });
};

export const createReturningApplication = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const applicantId = req.applicant!._id;

  const openCohort = await Cohort.findOne({
    status: "Open",
  });

  if (!openCohort) {
    sendError(res, "No open cohort.", 400);
    return;
  }

  // prevent duplicate application for same cohort
  const existing = await Registration.findOne({
    applicantId,
    cohortId: openCohort._id,
  });

  if (existing) {
    sendError(res, "You already applied for this cohort.", 400);
    return;
  }

  const center = await Center.findById(req.body.centerId);

  if (!center) {
    sendError(res, "Center not found", 404);
    return;
  }

  const referenceNumber = await generateRefNumber(center.code);

  const registration = await Registration.create({
    applicantId,
    cohortId: openCohort._id,

    centerId: req.body.centerId,
    programId: req.body.programId,
    secondChoiceId: req.body.secondChoiceId,

    qualification: req.body.qualification,
    employmentStatus: req.body.employmentStatus,
    priorExperience: req.body.priorExperience,
    experienceDetail: req.body.experienceDetail,

    motivation: req.body.motivation,
    postTrainingPlan: req.body.postTrainingPlan,
    referralSource: req.body.referralSource,

    specialNeeds: req.body.specialNeeds,
    emergencyName: req.body.emergencyName,
    emergencyPhone: req.body.emergencyPhone,
    emergencyRelation: req.body.emergencyRelation,

    status: "Pending",
    referenceNumber,
    appliedAt: new Date(),
  });

  sendSuccess(res, registration, "Application submitted successfully");
};
