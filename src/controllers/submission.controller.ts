import { Request, Response } from "express";
import { sendSuccess } from "../utils/apiResponse";
import { sendContactConfirmation } from "../services/mail.service";
import mongoose from "mongoose";
import { Submission } from "../models/submission.model";
import { ApiError } from "../utils/apiError";

export const createSubmission = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const submission = await Submission.create(req.body);
  sendContactConfirmation(req.body.email, req.body.name);
  sendSuccess(res, null, "Message sent. We'll get back to you shortly.", 201);
};

export const listSubmissions = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { read, enquiryType, page = "1", limit = "20" } = req.query;
  const filter: Record<string, unknown> = {};
  if (read !== undefined) filter.read = read === "true";
  if (enquiryType) filter.enquiryType = enquiryType;

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Submission.countDocuments(filter);
  const unread = await Submission.countDocuments({ read: false });

  const submissions = await Submission.find(filter)
    .sort("-createdAt")
    .skip(skip)
    .limit(Number(limit));

  sendSuccess(res, submissions, "OK", 200, {
    total,
    unread,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  });
};

export const markRead = async (req: Request, res: Response): Promise<void> => {
  const sub = await Submission.findByIdAndUpdate(
    req.params.id,
    {
      read: true,
      readBy: new mongoose.Types.ObjectId(req.user!._id),
      readAt: new Date(),
    },
    { new: true },
  );
  if (!sub) throw new ApiError("Submission not found.", 404);
  sendSuccess(res, sub, "Marked as read");
};

export const deleteSubmission = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const sub = await Submission.findByIdAndDelete(req.params.id);
  if (!sub) throw new ApiError("Submission not found.", 404);
  sendSuccess(res, null, "Submission deleted");
};
