import { Request, Response } from "express";
import User from "../models/user.model";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../services/token.service";
import { sendSuccess, sendError } from "../utils/apiResponse";
import { ApiError } from "../utils/apiError";
import { config } from "../config";
import { comparePassword, hashPassword } from "../utils/auth";
import { asyncHandler } from "../utils/asyncHandler";

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.app.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const adminLogin = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const user = await User.findOne({ email, isActive: true }).select(
      "+password",
    );
    if (!user || !(await comparePassword(password, user.password))) {
      sendError(res, "Invalid email or password", 401);
      return;
    }

    const accessToken = generateAccessToken(user.id, "admin");
    const refreshToken = generateRefreshToken(user.id, "admin");

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    res.cookie("adminRefreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

    sendSuccess(
      res,
      {
        accessToken,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          centerId: user.centerId,
        },
      },
      "Login successful",
    );
  },
);

export const adminRefreshToken = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies?.adminRefreshToken as string | undefined;
    if (!token) {
      sendError(res, "No refresh token", 401);
      return;
    }

    let decoded: { id: string };
    try {
      decoded = verifyRefreshToken(token, "admin") as { id: string };
    } catch {
      sendError(res, "Invalid refresh token", 401);
      return;
    }

    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user || user.refreshToken !== token) {
      sendError(res, "Refresh token mismatch", 401);
      return;
    }

    const accessToken = generateAccessToken(user.id, "admin");
    const newRefreshToken = generateRefreshToken(user.id, "admin");

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie("adminRefreshToken", newRefreshToken, REFRESH_COOKIE_OPTIONS);
    sendSuccess(res, { accessToken }, "Token refreshed");
  },
);

export const adminLogout = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies?.adminRefreshToken as string | undefined;
    if (token) {
      await User.findOneAndUpdate(
        { refreshToken: token },
        { refreshToken: null },
      );
    }
    res.clearCookie("adminRefreshToken");
    sendSuccess(res, null, "Logged out successfully");
  },
);

export const getAdminMe = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    sendSuccess(res, {
      id: req.user!._id,
      fullName: req.user!.fullName,
      email: req.user!.email,
      role: req.user!.role,
      centerId: req.user!.centerId,
      lastLogin: req.user!.lastLogin,
    });
  },
);

export const updateAdminMe = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { fullName, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { fullName, email },
      { new: true, runValidators: true },
    );
    sendSuccess(res, user, "Profile updated");
  },
);

export const changeAdminPassword = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user!._id).select("+password");
    if (!user || !(await comparePassword(currentPassword, user.password))) {
      sendError(res, "Current password is incorrect", 401);
      return;
    }

    user.password = newPassword;
    await user.save();
    sendSuccess(res, null, "Password changed successfully");
  },
);

export const createAdminUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { fullName, email, password: pw, role, centerId } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      sendError(res, "An admin with this email already exists", 409);
      return;
    }

    const user = await User.create({
      fullName,
      email,
      password: await hashPassword(pw),
      role,
      centerId: centerId || null,
    });

    sendSuccess(
      res,
      {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        centerId: user.centerId,
      },
      "Admin user created",
      201,
    );
  },
);

export const listAdminUsers = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const users = await User.find()
      .populate("centerId", "name code")
      .sort("-createdAt");
    sendSuccess(res, users);
  },
);

export const deactivateAdminUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    );
    if (!user) throw new ApiError("User not found", 404);
    sendSuccess(res, null, "User deactivated");
  },
);
