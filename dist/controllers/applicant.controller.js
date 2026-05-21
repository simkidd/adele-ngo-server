"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApplicantAnnouncements = exports.getApplicantCertificate = exports.getApplicantApplication = exports.changeApplicantPassword = exports.updateApplicantProfile = exports.getApplicantMe = exports.logoutApplicant = exports.refreshApplicantToken = exports.loginApplicant = exports.registerApplicant = void 0;
const generateRefNumber_1 = require("../utils/generateRefNumber");
const mail_service_1 = require("../services/mail.service");
const config_1 = require("../config");
const announcement_model_1 = require("../models/announcement.model");
const applicant_model_1 = require("../models/applicant.model");
const center_model_1 = require("../models/center.model");
const cohort_model_1 = require("../models/cohort.model");
const program_model_1 = require("../models/program.model");
const registration_model_1 = require("../models/registration.model");
const user_model_1 = __importDefault(require("../models/user.model"));
const token_service_1 = require("../services/token.service");
const apiResponse_1 = require("../utils/apiResponse");
const auth_1 = require("../utils/auth");
const certificate_model_1 = require("../models/certificate.model");
const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: config_1.config.app.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
// ── Register (new account + first application) ───────────────────────────────
const registerApplicant = async (req, res) => {
    const { 
    // Step 1 — from NIMC
    nin, fullName, dob, gender, stateOfOrigin, 
    // Step 2
    phone, whatsapp, email, lga, address, 
    // Step 3
    centerId, programId, secondChoiceId, 
    // Step 4
    qualification, employmentStatus, priorExperience, experienceDetail, 
    // Step 5
    motivation, postTrainingPlan, referralSource, 
    // Step 6
    specialNeeds, emergencyName, emergencyPhone, emergencyRelation, 
    // Step 7
    password, 
    // passport photo URL (from Cloudinary upload before form submit)
    passportPhoto, } = req.body;
    // Check email uniqueness
    const emailExists = await applicant_model_1.Applicant.findOne({ email });
    if (emailExists) {
        (0, apiResponse_1.sendError)(res, "An account with this email already exists. Please log in.", 409);
        return;
    }
    // Verify open cohort exists
    const openCohort = await cohort_model_1.Cohort.findOne({ status: "Open" });
    if (!openCohort) {
        (0, apiResponse_1.sendError)(res, "Applications are currently closed. No open cohort found.", 400);
        return;
    }
    // Validate center + program are in open cohort
    const centerConfig = openCohort.centers.find((c) => c.centerId.toString() === centerId);
    if (!centerConfig) {
        (0, apiResponse_1.sendError)(res, "Selected center is not available in the current cohort.", 400);
        return;
    }
    const programConfig = centerConfig.programs.find((p) => p.programId.toString() === programId);
    if (!programConfig) {
        (0, apiResponse_1.sendError)(res, "Selected program is not available at this center in the current cohort.", 400);
        return;
    }
    // Check seat availability
    if (programConfig.enrolledCount >= programConfig.totalSeats) {
        (0, apiResponse_1.sendError)(res, "This program is full. Please select another program or center.", 400);
        return;
    }
    // Get center code for ref number
    const center = await center_model_1.Center.findById(centerId);
    if (!center) {
        (0, apiResponse_1.sendError)(res, "Center not found.", 404);
        return;
    }
    // Create applicant account
    const applicant = await applicant_model_1.Applicant.create({
        email,
        password,
        fullName,
        dob: new Date(dob),
        gender,
        phone,
        whatsapp,
        stateOfOrigin,
        lga,
        address,
        passportPhoto: passportPhoto ?? "",
        nin,
    });
    // Generate reference number
    const referenceNumber = await (0, generateRefNumber_1.generateRefNumber)(center.code);
    // Create registration
    const registration = await registration_model_1.Registration.create({
        applicantId: applicant._id,
        cohortId: openCohort._id,
        centerId,
        programId,
        secondChoiceId: secondChoiceId || undefined,
        qualification,
        employmentStatus,
        priorExperience,
        experienceDetail,
        motivation,
        postTrainingPlan,
        referralSource,
        specialNeeds,
        emergencyName,
        emergencyPhone,
        emergencyRelation,
        referenceNumber,
        status: "Pending",
    });
    // Issue tokens
    const accessToken = (0, token_service_1.generateAccessToken)(applicant.id, "applicant");
    const refreshToken = (0, token_service_1.generateRefreshToken)(applicant.id, "applicant");
    applicant.refreshToken = refreshToken;
    applicant.lastLogin = new Date();
    await applicant.save({ validateBeforeSave: false });
    res.cookie("applicantRefreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
    // Send emails (non-blocking)
    const program = await program_model_1.Program.findById(programId);
    (0, mail_service_1.sendApplicationConfirmation)(email, fullName, referenceNumber, program?.title ?? "", center.name);
    // Alert all super_admins + center program officers
    const admins = await user_model_1.default.find({
        $or: [{ role: "super_admin" }, { role: "program_officer", centerId }],
        isActive: true,
    });
    admins.forEach((admin) => {
        (0, mail_service_1.sendAdminRegistrationAlert)(admin.email, fullName, program?.title ?? "", center.name, referenceNumber);
    });
    (0, apiResponse_1.sendSuccess)(res, {
        accessToken,
        applicant: {
            id: applicant.id,
            fullName: applicant.fullName,
            email: applicant.email,
        },
        referenceNumber,
    }, "Application submitted successfully", 201);
};
exports.registerApplicant = registerApplicant;
// ── Applicant login ───────────────────────────────────────────────────────────
const loginApplicant = async (req, res) => {
    const { email, password } = req.body;
    const applicant = await applicant_model_1.Applicant.findOne({ email, isActive: true }).select("+password");
    if (!applicant || !(await (0, auth_1.comparePassword)(password, applicant.password))) {
        (0, apiResponse_1.sendError)(res, "Invalid email or password", 401);
        return;
    }
    const accessToken = (0, token_service_1.generateAccessToken)(applicant.id, "applicant");
    const refreshToken = (0, token_service_1.generateRefreshToken)(applicant.id, "applicant");
    applicant.refreshToken = refreshToken;
    applicant.lastLogin = new Date();
    await applicant.save({ validateBeforeSave: false });
    res.cookie("applicantRefreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
    (0, apiResponse_1.sendSuccess)(res, {
        accessToken,
        applicant: {
            id: applicant.id,
            fullName: applicant.fullName,
            email: applicant.email,
        },
    }, "Login successful");
};
exports.loginApplicant = loginApplicant;
// ── Refresh token ─────────────────────────────────────────────────────────────
const refreshApplicantToken = async (req, res) => {
    const token = req.cookies?.applicantRefreshToken;
    if (!token) {
        (0, apiResponse_1.sendError)(res, "No refresh token", 401);
        return;
    }
    let decoded;
    try {
        decoded = (0, token_service_1.verifyRefreshToken)(token, "applicant");
    }
    catch {
        (0, apiResponse_1.sendError)(res, "Invalid refresh token", 401);
        return;
    }
    const applicant = await applicant_model_1.Applicant.findById(decoded.id).select("+refreshToken");
    if (!applicant || applicant.refreshToken !== token) {
        (0, apiResponse_1.sendError)(res, "Refresh token mismatch", 401);
        return;
    }
    const accessToken = (0, token_service_1.generateAccessToken)(applicant.id, "applicant");
    const newRefreshToken = (0, token_service_1.generateRefreshToken)(applicant.id, "applicant");
    applicant.refreshToken = newRefreshToken;
    await applicant.save({ validateBeforeSave: false });
    res.cookie("applicantRefreshToken", newRefreshToken, REFRESH_COOKIE_OPTIONS);
    (0, apiResponse_1.sendSuccess)(res, { accessToken }, "Token refreshed");
};
exports.refreshApplicantToken = refreshApplicantToken;
// ── Logout ────────────────────────────────────────────────────────────────────
const logoutApplicant = async (req, res) => {
    const token = req.cookies?.applicantRefreshToken;
    if (token) {
        await applicant_model_1.Applicant.findOneAndUpdate({ refreshToken: token }, { refreshToken: null });
    }
    res.clearCookie("applicantRefreshToken");
    (0, apiResponse_1.sendSuccess)(res, null, "Logged out successfully");
};
exports.logoutApplicant = logoutApplicant;
// ── Dashboard: Get me (profile + current application) ────────────────────────
const getApplicantMe = async (req, res) => {
    const applicant = req.applicant;
    // Current registration (most recent)
    const registration = await registration_model_1.Registration.findOne({
        applicantId: applicant._id,
    })
        .populate("programId", "title category")
        .populate("centerId", "name address")
        .populate("cohortId", "name startDate endDate status")
        .sort("-createdAt");
    // Certificate (if issued)
    const certificate = registration
        ? await certificate_model_1.Certificate.findOne({ registrationId: registration.id })
        : null;
    // Unread announcements
    const announcements = await announcement_model_1.Announcement.find({
        status: "Published",
        audience: {
            $in: [
                "Public",
                "All",
                registration?.status === "Enrolled" ? "Enrolled" : "Applicants",
            ],
        },
    })
        .sort("-publishedAt")
        .limit(5);
    (0, apiResponse_1.sendSuccess)(res, {
        applicant: {
            id: applicant._id,
            fullName: applicant.fullName,
            email: applicant.email,
            phone: applicant.phone,
            passportPhoto: applicant.passportPhoto,
            biometricEnrolled: applicant.biometricEnrolled,
        },
        registration,
        certificate,
        announcements,
    });
};
exports.getApplicantMe = getApplicantMe;
// ── Dashboard: Update profile ─────────────────────────────────────────────────
const updateApplicantProfile = async (req, res) => {
    const allowed = ["phone", "whatsapp", "address", "lga", "passportPhoto"];
    const updates = {};
    allowed.forEach((field) => {
        if (req.body[field] !== undefined)
            updates[field] = req.body[field];
    });
    const applicant = await applicant_model_1.Applicant.findByIdAndUpdate(req.applicant._id, updates, { new: true, runValidators: true });
    (0, apiResponse_1.sendSuccess)(res, applicant, "Profile updated");
};
exports.updateApplicantProfile = updateApplicantProfile;
// ── Dashboard: Change password ────────────────────────────────────────────────
const changeApplicantPassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const applicant = await applicant_model_1.Applicant.findById(req.applicant._id).select("+password");
    if (!applicant ||
        !(await (0, auth_1.comparePassword)(currentPassword, applicant.password))) {
        (0, apiResponse_1.sendError)(res, "Current password is incorrect", 401);
        return;
    }
    applicant.password = newPassword;
    await applicant.save();
    (0, apiResponse_1.sendSuccess)(res, null, "Password changed successfully");
};
exports.changeApplicantPassword = changeApplicantPassword;
// ── Dashboard: Get application detail ────────────────────────────────────────
const getApplicantApplication = async (req, res) => {
    const registration = await registration_model_1.Registration.findOne({
        applicantId: req.applicant._id,
    })
        .populate("programId", "title category description")
        .populate("centerId", "name address phone email")
        .populate("cohortId", "name startDate endDate applicationEnd status")
        .populate("secondChoiceId", "title")
        .sort("-createdAt");
    if (!registration) {
        // Check if cohort is open for re-application
        const openCohort = await cohort_model_1.Cohort.findOne({ status: "Open" });
        (0, apiResponse_1.sendSuccess)(res, { registration: null, canApply: !!openCohort });
        return;
    }
    (0, apiResponse_1.sendSuccess)(res, { registration });
};
exports.getApplicantApplication = getApplicantApplication;
// ── Dashboard: Get certificate ────────────────────────────────────────────────
const getApplicantCertificate = async (req, res) => {
    const certificate = await certificate_model_1.Certificate.findOne({
        applicantId: req.applicant._id,
    })
        .populate("programId", "title")
        .populate("centerId", "name")
        .populate("cohortId", "name");
    if (!certificate) {
        (0, apiResponse_1.sendSuccess)(res, { certificate: null });
        return;
    }
    (0, apiResponse_1.sendSuccess)(res, { certificate });
};
exports.getApplicantCertificate = getApplicantCertificate;
// ── Dashboard: Announcements ──────────────────────────────────────────────────
const getApplicantAnnouncements = async (req, res) => {
    const registration = await registration_model_1.Registration.findOne({
        applicantId: req.applicant._id,
    });
    const audienceFilter = registration?.status === "Enrolled"
        ? { $in: ["Public", "Applicants", "Enrolled", "All"] }
        : { $in: ["Public", "Applicants", "All"] };
    const announcements = await announcement_model_1.Announcement.find({
        status: "Published",
        audience: audienceFilter,
    })
        .sort("-publishedAt")
        .limit(20);
    (0, apiResponse_1.sendSuccess)(res, announcements);
};
exports.getApplicantAnnouncements = getApplicantAnnouncements;
//# sourceMappingURL=applicant.controller.js.map