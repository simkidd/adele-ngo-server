import { Request, Response } from "express";
import { sendSuccess } from "../utils/apiResponse";
import { slugify } from "../utils/helpers";
import { Program } from "../models/program.model";
import { ApiError } from "../utils/apiError";
import { Center } from "../models/center.model";

export const createProgram = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { title } = req.body;
  const slug = slugify(title);

  const program = await Program.create({
    ...req.body,
    slug,
    createdBy: req.user!._id,
  });

  sendSuccess(res, program, "Program created", 201);
};

export const listPrograms = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { category, active } = req.query;
  const filter: Record<string, unknown> = {};
  if (category) filter.category = category;
  if (active !== undefined) filter.isActive = active === "true";

  const programs = await Program.find(filter)
    .populate("createdBy", "fullName")
    .sort("category title");

  sendSuccess(res, programs);
};

export const getProgram = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id, slug } = req.params as {
    id?: string;
    slug?: string;
  };

  const conditions: any[] = [{ _id: id }, { slug }];
  const program = await Program.findOne({
    $or: conditions,
  });
  if (!program) throw new ApiError("Program not found.", 404);
  sendSuccess(res, program);
};

export const updateProgram = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const program = await Program.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!program) throw new ApiError("Program not found.", 404);
  sendSuccess(res, program, "Program updated");
};

export const toggleProgramActive = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const program = await Program.findById(req.params.id);
  if (!program) throw new ApiError("Program not found.", 404);
  program.isActive = !program.isActive;
  await program.save();
  sendSuccess(
    res,
    program,
    `Program ${program.isActive ? "activated" : "deactivated"}`,
  );
};

// Assign program to center
export const assignProgramToCenter = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { centerId } = req.body;
  const center = await Center.findById(centerId);
  if (!center) throw new ApiError("Center not found.", 404);

  const program = await Program.findById(req.params.id);
  if (!program) throw new ApiError("Program not found.", 404);

  if (!center.programs.includes(program._id)) {
    center.programs.push(program._id);
    await center.save();
  }

  sendSuccess(res, null, `Program assigned to ${center.name}`);
};

// Remove program from center
export const removeProgramFromCenter = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { centerId } = req.body;
  const center = await Center.findById(centerId);
  if (!center) throw new ApiError("Center not found.", 404);

  center.programs = center.programs.filter(
    (p) => p.toString() !== req.params.id,
  );
  await center.save();

  sendSuccess(res, null, "Program removed from center");
};
