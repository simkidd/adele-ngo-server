import { Router } from "express";
import {
  registerApplicant,
  loginApplicant,
  refreshApplicantToken,
  logoutApplicant,
  getApplicantMe,
  updateApplicantProfile,
  changeApplicantPassword,
  getApplicantApplication,
  getApplicantCertificate,
  getApplicantAnnouncements,
  getApplicantDashboard,
  getApplicantApplications,
  createReturningApplication,
} from "../controllers/applicant.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../middlewares/validate.middleware";
import { fullRegistrationSchema } from "../schemas/registration.schema";
import { applicantLoginSchema } from "../schemas/auth.schema";
import { uploadPassportPhoto } from "../middlewares/upload.middleware";
import { protectApplicant } from "../middlewares/auth.middleware";

const router = Router();

// Public
router.post(
  "/register",
  validate(fullRegistrationSchema),
  asyncHandler(registerApplicant),
);
router.post(
  "/login",
  validate(applicantLoginSchema),
  asyncHandler(loginApplicant),
);
router.post("/refresh", asyncHandler(refreshApplicantToken));
router.post("/logout", asyncHandler(logoutApplicant));

// Upload passport photo (pre-form, returns Cloudinary URL)
router.post("/upload/passport", uploadPassportPhoto, (req, res) => {
  const file = req.file as Express.Multer.File & { path: string };
  if (!file) {
    res.status(400).json({ success: false, message: "No file uploaded" });
    return;
  }
  res.json({ success: true, data: { url: file.path } });
});

// Protected — applicant dashboard
router.use(protectApplicant);

router.get("/me", asyncHandler(getApplicantMe));
router.patch("/me", asyncHandler(updateApplicantProfile));
router.patch("/me/password", asyncHandler(changeApplicantPassword));
router.get("/applications", asyncHandler(getApplicantApplications));
router.get("/application/:id", asyncHandler(getApplicantApplication));
router.get("/certificate", asyncHandler(getApplicantCertificate));
router.get("/announcements", asyncHandler(getApplicantAnnouncements));
router.get("/dashboard", asyncHandler(getApplicantDashboard));
router.post("/application/apply", asyncHandler(createReturningApplication));

export default router;
