"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignManager = exports.updateCenter = exports.getCenter = exports.listCenters = void 0;
const center_model_1 = require("../models/center.model");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const listCenters = async (_req, res) => {
    const centers = await center_model_1.Center.find()
        .populate("programs", "title category isActive")
        .populate("managerId", "fullName email");
    (0, apiResponse_1.sendSuccess)(res, centers);
};
exports.listCenters = listCenters;
const getCenter = async (req, res) => {
    const { id, slug } = req.params;
    const conditions = [];
    if (id) {
        conditions.push({ _id: id });
    }
    if (slug) {
        conditions.push({ slug });
    }
    const center = await center_model_1.Center.findOne({
        $or: conditions,
    }).populate("programs", "title category isActive");
    if (!center) {
        throw new apiError_1.ApiError("Center not found.", 404);
    }
    (0, apiResponse_1.sendSuccess)(res, center);
};
exports.getCenter = getCenter;
const updateCenter = async (req, res) => {
    const center = await center_model_1.Center.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!center)
        throw new apiError_1.ApiError("Center not found.", 404);
    (0, apiResponse_1.sendSuccess)(res, center, "Center updated");
};
exports.updateCenter = updateCenter;
const assignManager = async (req, res) => {
    const { managerId } = req.body;
    const center = await center_model_1.Center.findByIdAndUpdate(req.params.id, { managerId }, { new: true }).populate("managerId", "fullName email");
    if (!center)
        throw new apiError_1.ApiError("Center not found.", 404);
    (0, apiResponse_1.sendSuccess)(res, center, "Manager assigned");
};
exports.assignManager = assignManager;
//# sourceMappingURL=center.controller.js.map