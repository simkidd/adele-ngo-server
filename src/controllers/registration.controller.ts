import { Request, Response } from "express";
import { sendSuccess, sendError } from "../utils/apiResponse";
import {
  sendApplicationAccepted,
  sendApplicationEnrolled,
  sendApplicationRejected,
} from "../services/mail.service";
import mongoose from "mongoose";
import { Registration } from "../models/registration.model";
import { ApiError } from "../utils/apiError";
import { Cohort } from "../models/cohort.model";

// ── List all registrations (scoped to center for program_officer) ─────────────
export const listRegistrations = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const {
    centerId,
    programId,
    cohortId,
    status,
    page = "1",
    limit = "20",
  } = req.query;

  const filter: Record<string, unknown> = {};
  if (centerId)
    filter.centerId = new mongoose.Types.ObjectId(centerId as string);
  if (programId)
    filter.programId = new mongoose.Types.ObjectId(programId as string);
  if (cohortId)
    filter.cohortId = new mongoose.Types.ObjectId(cohortId as string);
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Registration.countDocuments(filter);

  const registrations = await Registration.find(filter)
    .populate(
      "applicantId",
      "fullName email phone passportPhoto ninVerified biometricEnrolled",
    )
    .populate("programId", "title category")
    .populate("centerId", "name code")
    .populate("cohortId", "name startDate endDate")
    .sort("-createdAt")
    .skip(skip)
    .limit(Number(limit));

  sendSuccess(res, registrations, "OK", 200, {
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    limit: Number(limit),
  });
};

// ── Get single registration ───────────────────────────────────────────────────
export const getRegistration = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const reg = await Registration.findById(req.params.id)
    .populate(
      "applicantId",
      "fullName email phone dob gender stateOfOrigin lga address passportPhoto ninVerified biometricEnrolled",
    )
    .populate("programId", "title category description")
    .populate("centerId", "name code address")
    .populate("cohortId", "name startDate endDate")
    .populate("secondChoiceId", "title")
    .populate("reviewedBy", "fullName");

  if (!reg) throw new ApiError("Registration not found.", 404);
  sendSuccess(res, reg);
};

// ── Update status ─────────────────────────────────────────────────────────────
export const updateRegistrationStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { status, adminNotes, verificationDeadline } = req.body;

  const registration = await Registration.findById(req.params.id)
    .populate("applicantId", "fullName email")
    .populate("centerId", "name address")
    .populate("cohortId", "name startDate");

  if (!registration) throw new ApiError("Registration not found.", 404);

  const applicant = registration.applicantId as unknown as {
    fullName: string;
    email: string;
  };
  const center = registration.centerId as unknown as {
    name: string;
    address: string;
  };
  const cohort = registration.cohortId as unknown as {
    name: string;
    startDate: Date;
  };

  // Set verification deadline when accepting
  if (status === "Accepted" && !registration.verificationDeadline) {
    const deadline = verificationDeadline
      ? new Date(verificationDeadline)
      : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days default
    registration.verificationDeadline = deadline;

    sendApplicationAccepted(
      applicant.email,
      applicant.fullName,
      (registration.programId as unknown as { title: string }).title,
      center.name,
      center.address,
      deadline,
    );
  }

  if (status === "Enrolled") {
    // Increment enrolled count in cohort
    await Cohort.updateOne(
      {
        _id: registration.cohortId,
        "centers.centerId": registration.centerId,
        "centers.programs.programId": registration.programId,
      },
      { $inc: { "centers.$[c].programs.$[p].enrolledCount": 1 } },
      {
        arrayFilters: [
          { "c.centerId": registration.centerId },
          { "p.programId": registration.programId },
        ],
      },
    );

    sendApplicationEnrolled(
      applicant.email,
      applicant.fullName,
      (registration.programId as unknown as { title: string }).title,
      cohort.name,
      cohort.startDate,
      center.name,
      center.address,
    );
  }

  // If reversing enrolled (dropping a slot) — decrement
  if (registration.status === "Enrolled" && status !== "Enrolled") {
    await Cohort.updateOne(
      {
        _id: registration.cohortId,
        "centers.centerId": registration.centerId,
        "centers.programs.programId": registration.programId,
      },
      { $inc: { "centers.$[c].programs.$[p].enrolledCount": -1 } },
      {
        arrayFilters: [
          { "c.centerId": registration.centerId },
          { "p.programId": registration.programId },
        ],
      },
    );
  }

  if (status === "Rejected") {
    sendApplicationRejected(
      applicant.email,
      applicant.fullName,
      (registration.programId as unknown as { title: string }).title,
    );
  }

  registration.status = status;
  registration.reviewedBy = new mongoose.Types.ObjectId(req.user!._id);
  if (adminNotes) registration.adminNotes = adminNotes;
  await registration.save();

  sendSuccess(res, registration, "Status updated");
};

// ── Delete registration (admin manual drop) ───────────────────────────────────
export const deleteRegistration = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const registration = await Registration.findById(req.params.id);
  if (!registration) throw new ApiError("Registration not found.", 404);

  // If enrolled — restore slot
  if (registration.status === "Enrolled") {
    await Cohort.updateOne(
      {
        _id: registration.cohortId,
        "centers.centerId": registration.centerId,
        "centers.programs.programId": registration.programId,
      },
      { $inc: { "centers.$[c].programs.$[p].enrolledCount": -1 } },
      {
        arrayFilters: [
          { "c.centerId": registration.centerId },
          { "p.programId": registration.programId },
        ],
      },
    );
  }

  await Registration.findByIdAndDelete(req.params.id);
  sendSuccess(res, null, "Registration removed and slot restored");
};

// ── Stats for overview ────────────────────────────────────────────────────────
export const getRegistrationStats = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { centerId } = req.query;
  const match: Record<string, unknown> = {};
  if (centerId)
    match.centerId = new mongoose.Types.ObjectId(centerId as string);

  const stats = await Registration.aggregate([
    { $match: match },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const result = {
    Pending: 0,
    Accepted: 0,
    Verified: 0,
    Enrolled: 0,
    Rejected: 0,
    total: 0,
  };

  stats.forEach(({ _id, count }) => {
    if (_id in result) (result as Record<string, number>)[_id] = count;
    result.total += count;
  });

  sendSuccess(res, result);
};
