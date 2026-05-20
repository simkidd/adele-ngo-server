"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectApplicant = exports.protectAdmin = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiError_1 = require("../utils/apiError");
const user_model_1 = __importDefault(require("../models/user.model"));
const applicant_model_1 = require("../models/applicant.model");
const token_service_1 = require("../services/token.service");
// ── Admin auth ────────────────────────────────────────────────────────────────
exports.protectAdmin = (0, asyncHandler_1.asyncHandler)(async (req, _res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        throw new apiError_1.ApiError("Not authenticated. Please log in.", 401);
    }
    let decoded;
    try {
        decoded = (0, token_service_1.verifyToken)(token, "admin");
    }
    catch {
        throw new apiError_1.ApiError("Invalid or expired token. Please log in again.", 401);
    }
    if (decoded.type !== "admin") {
        throw new apiError_1.ApiError("Access denied.", 403);
    }
    const user = await user_model_1.default.findById(decoded.id).select("+password");
    if (!user || !user.isActive) {
        throw new apiError_1.ApiError("User no longer exists or is inactive.", 401);
    }
    req.user = user;
    next();
});
// ── Applicant auth ────────────────────────────────────────────────────────────
exports.protectApplicant = (0, asyncHandler_1.asyncHandler)(async (req, _res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        throw new apiError_1.ApiError("Not authenticated. Please log in.", 401);
    }
    let decoded;
    try {
        decoded = (0, token_service_1.verifyToken)(token, "applicant");
    }
    catch {
        throw new apiError_1.ApiError("Invalid or expired token. Please log in again.", 401);
    }
    if (decoded.type !== "applicant") {
        throw new apiError_1.ApiError("Access denied.", 403);
    }
    const applicant = await applicant_model_1.Applicant.findById(decoded.id);
    if (!applicant || !applicant.isActive) {
        throw new apiError_1.ApiError("Account no longer exists or is inactive.", 401);
    }
    req.applicant = applicant;
    next();
});
//# sourceMappingURL=auth.middleware.js.map