import { Request, Response } from "express";
import { Announcement } from "../models/announcement.model";
import { ApiError } from "../utils/apiError";
import { sendSuccess } from "../utils/apiResponse";

export const createAnnouncement = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const announcement = await Announcement.create({
    ...req.body,
    createdBy: req.user!._id,
    publishedAt: req.body.status === "Published" ? new Date() : undefined,
    expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : undefined,
  });
  sendSuccess(res, announcement, "Announcement created", 201);
};

export const listAnnouncements = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { status, audience, type } = req.query;
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (audience) filter.audience = audience;
  if (type) filter.type = type;

  const announcements = await Announcement.find(filter)
    .populate("createdBy", "fullName")
    .populate("centerId", "name")
    .sort("-createdAt");

  sendSuccess(res, announcements);
};

export const getPublicAnnouncements = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const now = new Date();
  const announcements = await Announcement.find({
    status: "Published",
    audience: { $in: ["Public", "All"] },
    $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
  })
    .sort("-publishedAt")
    .limit(10);

  sendSuccess(res, announcements);
};

export const updateAnnouncement = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const announcement = await Announcement.findById(req.params.id);
  if (!announcement) throw new ApiError("Announcement not found.", 404);

  if (req.body.status === "Published" && announcement.status !== "Published") {
    req.body.publishedAt = new Date();
  }

  const updated = await Announcement.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
  );
  sendSuccess(res, updated, "Announcement updated");
};

export const deleteAnnouncement = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const a = await Announcement.findByIdAndDelete(req.params.id);
  if (!a) throw new ApiError("Announcement not found.", 404);
  sendSuccess(res, null, "Announcement deleted");
};
