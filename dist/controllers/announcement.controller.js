"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAnnouncement = exports.updateAnnouncement = exports.getPublicAnnouncements = exports.listAnnouncements = exports.createAnnouncement = void 0;
const announcement_model_1 = require("../models/announcement.model");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const createAnnouncement = async (req, res) => {
    const announcement = await announcement_model_1.Announcement.create({
        ...req.body,
        createdBy: req.user._id,
        publishedAt: req.body.status === "Published" ? new Date() : undefined,
        expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : undefined,
    });
    (0, apiResponse_1.sendSuccess)(res, announcement, "Announcement created", 201);
};
exports.createAnnouncement = createAnnouncement;
const listAnnouncements = async (req, res) => {
    const { status, audience, type } = req.query;
    const filter = {};
    if (status)
        filter.status = status;
    if (audience)
        filter.audience = audience;
    if (type)
        filter.type = type;
    const announcements = await announcement_model_1.Announcement.find(filter)
        .populate("createdBy", "fullName")
        .populate("centerId", "name")
        .sort("-createdAt");
    (0, apiResponse_1.sendSuccess)(res, announcements);
};
exports.listAnnouncements = listAnnouncements;
const getPublicAnnouncements = async (_req, res) => {
    const now = new Date();
    const announcements = await announcement_model_1.Announcement.find({
        status: "Published",
        audience: { $in: ["Public", "All"] },
        $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
    })
        .sort("-publishedAt")
        .limit(10);
    (0, apiResponse_1.sendSuccess)(res, announcements);
};
exports.getPublicAnnouncements = getPublicAnnouncements;
const updateAnnouncement = async (req, res) => {
    const announcement = await announcement_model_1.Announcement.findById(req.params.id);
    if (!announcement)
        throw new apiError_1.ApiError("Announcement not found.", 404);
    if (req.body.status === "Published" && announcement.status !== "Published") {
        req.body.publishedAt = new Date();
    }
    const updated = await announcement_model_1.Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    (0, apiResponse_1.sendSuccess)(res, updated, "Announcement updated");
};
exports.updateAnnouncement = updateAnnouncement;
const deleteAnnouncement = async (req, res) => {
    const a = await announcement_model_1.Announcement.findByIdAndDelete(req.params.id);
    if (!a)
        throw new apiError_1.ApiError("Announcement not found.", 404);
    (0, apiResponse_1.sendSuccess)(res, null, "Announcement deleted");
};
exports.deleteAnnouncement = deleteAnnouncement;
//# sourceMappingURL=announcement.controller.js.map