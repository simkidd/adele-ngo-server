"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOpenCohort = exports.updateCohortStatus = exports.updateCohort = exports.getCohort = exports.listCohorts = exports.createCohort = void 0;
const cohort_model_1 = require("../models/cohort.model");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const createCohort = async (req, res) => {
    // Only one Open or Active cohort allowed at a time
    const active = await cohort_model_1.Cohort.findOne({ status: { $in: ["Open", "Active"] } });
    if (active) {
        (0, apiResponse_1.sendError)(res, `Cannot create a new cohort while "${active.name}" is ${active.status}. Close or complete it first.`, 409);
        return;
    }
    const cohort = await cohort_model_1.Cohort.create({
        ...req.body,
        applicationStart: new Date(req.body.applicationStart),
        applicationEnd: new Date(req.body.applicationEnd),
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
        createdBy: req.user._id,
    });
    (0, apiResponse_1.sendSuccess)(res, cohort, "Cohort created", 201);
};
exports.createCohort = createCohort;
const listCohorts = async (_req, res) => {
    const cohorts = await cohort_model_1.Cohort.find()
        .populate("centers.centerId", "name code")
        .populate("centers.programs.programId", "title category")
        .populate("createdBy", "fullName")
        .sort("-createdAt");
    (0, apiResponse_1.sendSuccess)(res, cohorts);
};
exports.listCohorts = listCohorts;
const getCohort = async (req, res) => {
    const cohort = await cohort_model_1.Cohort.findById(req.params.id)
        .populate("centers.centerId", "name code address")
        .populate("centers.programs.programId", "title category");
    if (!cohort)
        throw new apiError_1.ApiError("Cohort not found.", 404);
    (0, apiResponse_1.sendSuccess)(res, cohort);
};
exports.getCohort = getCohort;
const updateCohort = async (req, res) => {
    const cohort = await cohort_model_1.Cohort.findById(req.params.id);
    if (!cohort)
        throw new apiError_1.ApiError("Cohort not found.", 404);
    if (cohort.status === "Completed") {
        (0, apiResponse_1.sendError)(res, "Completed cohorts cannot be edited.", 400);
        return;
    }
    const updated = await cohort_model_1.Cohort.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    (0, apiResponse_1.sendSuccess)(res, updated, "Cohort updated");
};
exports.updateCohort = updateCohort;
const updateCohortStatus = async (req, res) => {
    const { status } = req.body;
    const cohort = await cohort_model_1.Cohort.findById(req.params.id);
    if (!cohort)
        throw new apiError_1.ApiError("Cohort not found.", 404);
    // Enforce valid transitions
    const validTransitions = {
        Draft: ["Open"],
        Open: ["Closed"],
        Closed: ["Active"],
        Active: ["Completed"],
        Completed: [],
    };
    if (!validTransitions[cohort.status]?.includes(status)) {
        (0, apiResponse_1.sendError)(res, `Cannot transition from "${cohort.status}" to "${status}".`, 400);
        return;
    }
    // Ensure no other Open/Active cohort when opening
    if (status === "Open") {
        const conflict = await cohort_model_1.Cohort.findOne({
            status: { $in: ["Open", "Active"] },
            _id: { $ne: cohort._id },
        });
        if (conflict) {
            (0, apiResponse_1.sendError)(res, `"${conflict.name}" is already ${conflict.status}. Close it before opening a new cohort.`, 409);
            return;
        }
    }
    cohort.status = status;
    if (status === "Open")
        cohort.publishedAt = new Date();
    if (status === "Completed")
        cohort.completedAt = new Date();
    await cohort.save();
    (0, apiResponse_1.sendSuccess)(res, cohort, `Cohort status updated to ${status}`);
};
exports.updateCohortStatus = updateCohortStatus;
// Public — current open cohort with availability
const getOpenCohort = async (_req, res) => {
    const cohort = await cohort_model_1.Cohort.findOne({ status: "Open" })
        .populate("centers.centerId", "name slug code address phone")
        .populate("centers.programs.programId", "title category description");
    if (!cohort) {
        (0, apiResponse_1.sendSuccess)(res, null, "No cohort currently open");
        return;
    }
    // Attach seat availability
    const cohortData = cohort.toObject();
    (0, apiResponse_1.sendSuccess)(res, cohortData);
};
exports.getOpenCohort = getOpenCohort;
//# sourceMappingURL=cohort.controller.js.map