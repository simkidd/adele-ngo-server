import { Request, Response } from "express";
import { Center } from "../models/center.model";
import { ApiError } from "../utils/apiError";
import { sendSuccess } from "../utils/apiResponse";

export const listCenters = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const centers = await Center.find()
    .populate("programs", "title category isActive")
    .populate("managerId", "fullName email");
  sendSuccess(res, centers);
};

export const getCenter = async (req: Request, res: Response): Promise<void> => {
  const { id, slug } = req.params as {
    id?: string;
    slug?: string;
  };

  const conditions: any[] = [];

  if (id) {
    conditions.push({ _id: id });
  }

  if (slug) {
    conditions.push({ slug });
  }

  const center = await Center.findOne({
    $or: conditions,
  }).populate("programs", "title category isActive");

  if (!center) {
    throw new ApiError("Center not found.", 404);
  }

  sendSuccess(res, center);
};

export const updateCenter = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const center = await Center.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!center) throw new ApiError("Center not found.", 404);
  sendSuccess(res, center, "Center updated");
};

export const assignManager = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { managerId } = req.body;
  const center = await Center.findByIdAndUpdate(
    req.params.id,
    { managerId },
    { new: true },
  ).populate("managerId", "fullName email");
  if (!center) throw new ApiError("Center not found.", 404);
  sendSuccess(res, center, "Manager assigned");
};
