"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateAdminUser = exports.listAdminUsers = exports.createAdminUser = exports.changeAdminPassword = exports.updateAdminMe = exports.getAdminMe = exports.adminLogout = exports.adminRefreshToken = exports.adminLogin = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const token_service_1 = require("../services/token.service");
const apiResponse_1 = require("../utils/apiResponse");
const apiError_1 = require("../utils/apiError");
const config_1 = require("../config");
const auth_1 = require("../utils/auth");
const asyncHandler_1 = require("../utils/asyncHandler");
const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: config_1.config.app.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
exports.adminLogin = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    const user = await user_model_1.default.findOne({ email, isActive: true }).select("+password");
    if (!user || !(await (0, auth_1.comparePassword)(password, user.password))) {
        (0, apiResponse_1.sendError)(res, "Invalid email or password", 401);
        return;
    }
    const accessToken = (0, token_service_1.generateAccessToken)(user.id, "admin");
    const refreshToken = (0, token_service_1.generateRefreshToken)(user.id, "admin");
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });
    res.cookie("adminRefreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
    (0, apiResponse_1.sendSuccess)(res, {
        accessToken,
        user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            centerId: user.centerId,
        },
    }, "Login successful");
});
exports.adminRefreshToken = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const token = req.cookies?.adminRefreshToken;
    if (!token) {
        (0, apiResponse_1.sendError)(res, "No refresh token", 401);
        return;
    }
    let decoded;
    try {
        decoded = (0, token_service_1.verifyRefreshToken)(token, "admin");
    }
    catch {
        (0, apiResponse_1.sendError)(res, "Invalid refresh token", 401);
        return;
    }
    const user = await user_model_1.default.findById(decoded.id).select("+refreshToken");
    if (!user || user.refreshToken !== token) {
        (0, apiResponse_1.sendError)(res, "Refresh token mismatch", 401);
        return;
    }
    const accessToken = (0, token_service_1.generateAccessToken)(user.id, "admin");
    const newRefreshToken = (0, token_service_1.generateRefreshToken)(user.id, "admin");
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });
    res.cookie("adminRefreshToken", newRefreshToken, REFRESH_COOKIE_OPTIONS);
    (0, apiResponse_1.sendSuccess)(res, { accessToken }, "Token refreshed");
});
exports.adminLogout = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const token = req.cookies?.adminRefreshToken;
    if (token) {
        await user_model_1.default.findOneAndUpdate({ refreshToken: token }, { refreshToken: null });
    }
    res.clearCookie("adminRefreshToken");
    (0, apiResponse_1.sendSuccess)(res, null, "Logged out successfully");
});
exports.getAdminMe = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    (0, apiResponse_1.sendSuccess)(res, {
        id: req.user.id,
        fullName: req.user.fullName,
        email: req.user.email,
        role: req.user.role,
        centerId: req.user.centerId,
        lastLogin: req.user.lastLogin,
    });
});
exports.updateAdminMe = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { fullName, email } = req.body;
    const user = await user_model_1.default.findByIdAndUpdate(req.user.id, { fullName, email }, { new: true, runValidators: true });
    (0, apiResponse_1.sendSuccess)(res, user, "Profile updated");
});
exports.changeAdminPassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await user_model_1.default.findById(req.user.id).select("+password");
    if (!user || !(await (0, auth_1.comparePassword)(currentPassword, user.password))) {
        (0, apiResponse_1.sendError)(res, "Current password is incorrect", 401);
        return;
    }
    user.password = newPassword;
    await user.save();
    (0, apiResponse_1.sendSuccess)(res, null, "Password changed successfully");
});
exports.createAdminUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { fullName, email, password, role, centerId } = req.body;
    const existing = await user_model_1.default.findOne({ email });
    if (existing) {
        (0, apiResponse_1.sendError)(res, "An admin with this email already exists", 409);
        return;
    }
    const user = await user_model_1.default.create({
        fullName,
        email,
        password,
        role,
        centerId: centerId || null,
    });
    (0, apiResponse_1.sendSuccess)(res, {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        centerId: user.centerId,
    }, "Admin user created", 201);
});
exports.listAdminUsers = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const users = await user_model_1.default.find()
        .populate("centerId", "name code")
        .sort("-createdAt");
    (0, apiResponse_1.sendSuccess)(res, users);
});
exports.deactivateAdminUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await user_model_1.default.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!user)
        throw new apiError_1.ApiError("User not found", 404);
    (0, apiResponse_1.sendSuccess)(res, null, "User deactivated");
});
//# sourceMappingURL=auth.controller.js.map