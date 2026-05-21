"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubmission = exports.markRead = exports.listSubmissions = exports.createSubmission = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const mail_service_1 = require("../services/mail.service");
const mongoose_1 = __importDefault(require("mongoose"));
const submission_model_1 = require("../models/submission.model");
const apiError_1 = require("../utils/apiError");
const createSubmission = async (req, res) => {
    const submission = await submission_model_1.Submission.create(req.body);
    (0, mail_service_1.sendContactConfirmation)(req.body.email, req.body.name);
    (0, apiResponse_1.sendSuccess)(res, null, "Message sent. We'll get back to you shortly.", 201);
};
exports.createSubmission = createSubmission;
const listSubmissions = async (req, res) => {
    const { read, enquiryType, page = "1", limit = "20" } = req.query;
    const filter = {};
    if (read !== undefined)
        filter.read = read === "true";
    if (enquiryType)
        filter.enquiryType = enquiryType;
    const skip = (Number(page) - 1) * Number(limit);
    const total = await submission_model_1.Submission.countDocuments(filter);
    const unread = await submission_model_1.Submission.countDocuments({ read: false });
    const submissions = await submission_model_1.Submission.find(filter)
        .sort("-createdAt")
        .skip(skip)
        .limit(Number(limit));
    (0, apiResponse_1.sendSuccess)(res, submissions, "OK", 200, {
        total,
        unread,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
    });
};
exports.listSubmissions = listSubmissions;
const markRead = async (req, res) => {
    const sub = await submission_model_1.Submission.findByIdAndUpdate(req.params.id, {
        read: true,
        readBy: new mongoose_1.default.Types.ObjectId(req.user._id),
        readAt: new Date(),
    }, { new: true });
    if (!sub)
        throw new apiError_1.ApiError("Submission not found.", 404);
    (0, apiResponse_1.sendSuccess)(res, sub, "Marked as read");
};
exports.markRead = markRead;
const deleteSubmission = async (req, res) => {
    const sub = await submission_model_1.Submission.findByIdAndDelete(req.params.id);
    if (!sub)
        throw new apiError_1.ApiError("Submission not found.", 404);
    (0, apiResponse_1.sendSuccess)(res, null, "Submission deleted");
};
exports.deleteSubmission = deleteSubmission;
//# sourceMappingURL=submission.controller.js.map