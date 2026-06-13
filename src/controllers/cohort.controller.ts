import { Request, Response } from "express";
import { Cohort } from "../models/cohort.model";
import { ApiError } from "../utils/apiError";
import { sendSuccess, sendError } from "../utils/apiResponse";

export const createCohort = async (
  req: Request,
  res: Response,
): Promise<void> => {
  // Only one Open or Active cohort allowed at a time
  const active = await Cohort.findOne({ status: { $in: ["Open", "Active"] } });
  if (active) {
    sendError(
      res,
      `Cannot create a new cohort while "${active.name}" is ${active.status}. Close or complete it first.`,
      409,
    );
    return;
  }

  const cohort = await Cohort.create({
    ...req.body,
    applicationStart: new Date(req.body.applicationStart),
    applicationEnd: new Date(req.body.applicationEnd),
    startDate: new Date(req.body.startDate),
    endDate: new Date(req.body.endDate),
    createdBy: req.user!._id,
  });

  sendSuccess(res, cohort, "Cohort created", 201);
};

export const listCohorts = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const cohorts = await Cohort.find()
    .populate("centers.centerId", "name code")
    .populate("centers.programs.programId", "title category")
    .populate("createdBy", "fullName")
    .sort("-createdAt");
  sendSuccess(res, cohorts);
};

export const getCohort = async (req: Request, res: Response): Promise<void> => {
  const cohort = await Cohort.findById(req.params.id)
    .populate("centers.centerId", "name code address")
    .populate("centers.programs.programId", "title category");
  if (!cohort) throw new ApiError("Cohort not found.", 404);
  sendSuccess(res, cohort);
};

export const updateCohort = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const cohort = await Cohort.findById(req.params.id);
  if (!cohort) throw new ApiError("Cohort not found.", 404);

  if (cohort.status === "Completed") {
    sendError(res, "Completed cohorts cannot be edited.", 400);
    return;
  }

  const updated = await Cohort.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: "after",
    runValidators: true,
  });
  sendSuccess(res, updated, "Cohort updated");
};

export const updateCohortStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { status } = req.body;
  const cohort = await Cohort.findById(req.params.id);
  if (!cohort) throw new ApiError("Cohort not found.", 404);

  // Enforce valid transitions
  const validTransitions: Record<string, string[]> = {
    Draft: ["Open"],
    Open: ["Closed"],
    Closed: ["Active"],
    Active: ["Completed"],
    Completed: [],
  };

  if (!validTransitions[cohort.status]?.includes(status)) {
    sendError(
      res,
      `Cannot transition from "${cohort.status}" to "${status}".`,
      400,
    );
    return;
  }

  // Ensure no other Open/Active cohort when opening
  if (status === "Open") {
    const conflict = await Cohort.findOne({
      status: { $in: ["Open", "Active"] },
      _id: { $ne: cohort._id },
    });
    if (conflict) {
      sendError(
        res,
        `"${conflict.name}" is already ${conflict.status}. Close it before opening a new cohort.`,
        409,
      );
      return;
    }
  }

  cohort.status = status;
  if (status === "Open") cohort.publishedAt = new Date();
  if (status === "Completed") cohort.completedAt = new Date();
  await cohort.save();

  sendSuccess(res, cohort, `Cohort status updated to ${status}`);
};

// Public — current open cohort with availability
export const getOpenCohort = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const cohort = await Cohort.findOne({ status: "Open" })
    .populate("centers.centerId", "name slug code address phone")
    .populate("centers.programs.programId", "title category description");

  if (!cohort) {
    sendSuccess(res, null, "No cohort currently open");
    return;
  }

  // Attach seat availability
  const cohortData = cohort.toObject();

  sendSuccess(res, cohortData);
};
