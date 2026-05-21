"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRegistrationStats = exports.deleteRegistration = exports.updateRegistrationStatus = exports.getRegistration = exports.listRegistrations = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const mail_service_1 = require("../services/mail.service");
const mongoose_1 = __importDefault(require("mongoose"));
const registration_model_1 = require("../models/registration.model");
const apiError_1 = require("../utils/apiError");
const cohort_model_1 = require("../models/cohort.model");
// ── List all registrations (scoped to center for program_officer) ─────────────
const listRegistrations = async (req, res) => {
    const { centerId, programId, cohortId, status, page = "1", limit = "20", } = req.query;
    const filter = {};
    if (centerId)
        filter.centerId = new mongoose_1.default.Types.ObjectId(centerId);
    if (programId)
        filter.programId = new mongoose_1.default.Types.ObjectId(programId);
    if (cohortId)
        filter.cohortId = new mongoose_1.default.Types.ObjectId(cohortId);
    if (status)
        filter.status = status;
    const skip = (Number(page) - 1) * Number(limit);
    const total = await registration_model_1.Registration.countDocuments(filter);
    const registrations = await registration_model_1.Registration.find(filter)
        .populate("applicantId", "fullName email phone passportPhoto ninVerified biometricEnrolled")
        .populate("programId", "title category")
        .populate("centerId", "name code")
        .populate("cohortId", "name startDate endDate")
        .sort("-createdAt")
        .skip(skip)
        .limit(Number(limit));
    (0, apiResponse_1.sendSuccess)(res, registrations, "OK", 200, {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
    });
};
exports.listRegistrations = listRegistrations;
// ── Get single registration ───────────────────────────────────────────────────
const getRegistration = async (req, res) => {
    const reg = await registration_model_1.Registration.findById(req.params.id)
        .populate("applicantId", "fullName email phone dob gender stateOfOrigin lga address passportPhoto ninVerified biometricEnrolled")
        .populate("programId", "title category description")
        .populate("centerId", "name code address")
        .populate("cohortId", "name startDate endDate")
        .populate("secondChoiceId", "title")
        .populate("reviewedBy", "fullName");
    if (!reg)
        throw new apiError_1.ApiError("Registration not found.", 404);
    (0, apiResponse_1.sendSuccess)(res, reg);
};
exports.getRegistration = getRegistration;
// ── Update status ─────────────────────────────────────────────────────────────
const updateRegistrationStatus = async (req, res) => {
    const { status, adminNotes, verificationDeadline } = req.body;
    const registration = await registration_model_1.Registration.findById(req.params.id)
        .populate("applicantId", "fullName email")
        .populate("centerId", "name address")
        .populate("cohortId", "name startDate");
    if (!registration)
        throw new apiError_1.ApiError("Registration not found.", 404);
    const applicant = registration.applicantId;
    const center = registration.centerId;
    const cohort = registration.cohortId;
    // Set verification deadline when accepting
    if (status === "Accepted" && !registration.verificationDeadline) {
        const deadline = verificationDeadline
            ? new Date(verificationDeadline)
            : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days default
        registration.verificationDeadline = deadline;
        (0, mail_service_1.sendApplicationAccepted)(applicant.email, applicant.fullName, registration.programId.title, center.name, center.address, deadline);
    }
    if (status === "Enrolled") {
        // Increment enrolled count in cohort
        await cohort_model_1.Cohort.updateOne({
            _id: registration.cohortId,
            "centers.centerId": registration.centerId,
            "centers.programs.programId": registration.programId,
        }, { $inc: { "centers.$[c].programs.$[p].enrolledCount": 1 } }, {
            arrayFilters: [
                { "c.centerId": registration.centerId },
                { "p.programId": registration.programId },
            ],
        });
        (0, mail_service_1.sendApplicationEnrolled)(applicant.email, applicant.fullName, registration.programId.title, cohort.name, cohort.startDate, center.name, center.address);
    }
    // If reversing enrolled (dropping a slot) — decrement
    if (registration.status === "Enrolled" && status !== "Enrolled") {
        await cohort_model_1.Cohort.updateOne({
            _id: registration.cohortId,
            "centers.centerId": registration.centerId,
            "centers.programs.programId": registration.programId,
        }, { $inc: { "centers.$[c].programs.$[p].enrolledCount": -1 } }, {
            arrayFilters: [
                { "c.centerId": registration.centerId },
                { "p.programId": registration.programId },
            ],
        });
    }
    if (status === "Rejected") {
        (0, mail_service_1.sendApplicationRejected)(applicant.email, applicant.fullName, registration.programId.title);
    }
    registration.status = status;
    registration.reviewedBy = new mongoose_1.default.Types.ObjectId(req.user._id);
    if (adminNotes)
        registration.adminNotes = adminNotes;
    await registration.save();
    (0, apiResponse_1.sendSuccess)(res, registration, "Status updated");
};
exports.updateRegistrationStatus = updateRegistrationStatus;
// ── Delete registration (admin manual drop) ───────────────────────────────────
const deleteRegistration = async (req, res) => {
    const registration = await registration_model_1.Registration.findById(req.params.id);
    if (!registration)
        throw new apiError_1.ApiError("Registration not found.", 404);
    // If enrolled — restore slot
    if (registration.status === "Enrolled") {
        await cohort_model_1.Cohort.updateOne({
            _id: registration.cohortId,
            "centers.centerId": registration.centerId,
            "centers.programs.programId": registration.programId,
        }, { $inc: { "centers.$[c].programs.$[p].enrolledCount": -1 } }, {
            arrayFilters: [
                { "c.centerId": registration.centerId },
                { "p.programId": registration.programId },
            ],
        });
    }
    await registration_model_1.Registration.findByIdAndDelete(req.params.id);
    (0, apiResponse_1.sendSuccess)(res, null, "Registration removed and slot restored");
};
exports.deleteRegistration = deleteRegistration;
// ── Stats for overview ────────────────────────────────────────────────────────
const getRegistrationStats = async (req, res) => {
    const { centerId } = req.query;
    const match = {};
    if (centerId)
        match.centerId = new mongoose_1.default.Types.ObjectId(centerId);
    const stats = await registration_model_1.Registration.aggregate([
        { $match: match },
        { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const result = {
        Pending: 0,
        Accepted: 0,
        Verified: 0,
        Enrolled: 0,
        Rejected: 0,
        total: 0,
    };
    stats.forEach(({ _id, count }) => {
        if (_id in result)
            result[_id] = count;
        result.total += count;
    });
    (0, apiResponse_1.sendSuccess)(res, result);
};
exports.getRegistrationStats = getRegistrationStats;
//# sourceMappingURL=registration.controller.js.map