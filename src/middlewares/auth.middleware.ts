import { NextFunction, Request, Response } from "express";
import { config } from "../config";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model";
import { env } from "process";
import { Applicant } from "../models/applicant.model";
import { verifyToken } from "../services/token.service";

export interface AuthRequest extends Request {
  user?: any;
  applicant?: any;
}

// ── Admin auth ────────────────────────────────────────────────────────────────
export const protectAdmin = asyncHandler(
  async (req: AuthRequest, _res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError("Not authenticated. Please log in.", 401);
    }

    let decoded: JwtPayload;
    try {
      decoded = verifyToken(token, "admin");
    } catch {
      throw new ApiError("Invalid or expired token. Please log in again.", 401);
    }

    if (decoded.type !== "admin") {
      throw new ApiError("Access denied.", 403);
    }

    const user = await User.findById(decoded.id).select("+password");
    if (!user || !user.isActive) {
      throw new ApiError("User no longer exists or is inactive.", 401);
    }

    req.user = user;
    next();
  },
);

// ── Applicant auth ────────────────────────────────────────────────────────────
export const protectApplicant = asyncHandler(
  async (req: AuthRequest, _res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError("Not authenticated. Please log in.", 401);
    }

    let decoded: JwtPayload;
    try {
      decoded = verifyToken(token, "applicant");
    } catch {
      throw new ApiError("Invalid or expired token. Please log in again.", 401);
    }

    if (decoded.type !== "applicant") {
      throw new ApiError("Access denied.", 403);
    }

    const applicant = await Applicant.findById(decoded.id);
    if (!applicant || !applicant.isActive) {
      throw new ApiError("Account no longer exists or is inactive.", 401);
    }

    req.applicant = applicant;
    next();
  },
);
