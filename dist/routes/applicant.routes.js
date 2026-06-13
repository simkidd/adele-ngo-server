"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const applicant_controller_1 = require("../controllers/applicant.controller");
const asyncHandler_1 = require("../utils/asyncHandler");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const registration_schema_1 = require("../schemas/registration.schema");
const auth_schema_1 = require("../schemas/auth.schema");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public
router.post("/register", (0, validate_middleware_1.validate)(registration_schema_1.fullRegistrationSchema), (0, asyncHandler_1.asyncHandler)(applicant_controller_1.registerApplicant));
router.post("/login", (0, validate_middleware_1.validate)(auth_schema_1.applicantLoginSchema), (0, asyncHandler_1.asyncHandler)(applicant_controller_1.loginApplicant));
router.post("/refresh", (0, asyncHandler_1.asyncHandler)(applicant_controller_1.refreshApplicantToken));
router.post("/logout", (0, asyncHandler_1.asyncHandler)(applicant_controller_1.logoutApplicant));
// Upload passport photo (pre-form, returns Cloudinary URL)
router.post("/upload/passport", upload_middleware_1.uploadPassportPhoto, (req, res) => {
    const file = req.file;
    if (!file) {
        res.status(400).json({ success: false, message: "No file uploaded" });
        return;
    }
    res.json({ success: true, data: { url: file.path } });
});
// Protected — applicant dashboard
router.use(auth_middleware_1.protectApplicant);
router.get("/me", (0, asyncHandler_1.asyncHandler)(applicant_controller_1.getApplicantMe));
router.patch("/me", (0, asyncHandler_1.asyncHandler)(applicant_controller_1.updateApplicantProfile));
router.patch("/me/password", (0, asyncHandler_1.asyncHandler)(applicant_controller_1.changeApplicantPassword));
router.get("/applications", (0, asyncHandler_1.asyncHandler)(applicant_controller_1.getApplicantApplications));
router.get("/application/:id", (0, asyncHandler_1.asyncHandler)(applicant_controller_1.getApplicantApplication));
router.get("/certificate", (0, asyncHandler_1.asyncHandler)(applicant_controller_1.getApplicantCertificate));
router.get("/announcements", (0, asyncHandler_1.asyncHandler)(applicant_controller_1.getApplicantAnnouncements));
router.get("/dashboard", (0, asyncHandler_1.asyncHandler)(applicant_controller_1.getApplicantDashboard));
router.post("/application/apply", (0, asyncHandler_1.asyncHandler)(applicant_controller_1.createReturningApplication));
exports.default = router;
//# sourceMappingURL=applicant.routes.js.map