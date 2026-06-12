import { Router } from "express";
import authRoutes from "./auth.routes";
import applicantRoutes from "./applicant.routes";
import programRoutes from "./program.routes";
import cohortRoutes from "./cohort.routes";
import registrationRoutes from "./registration.routes";
import certificateRoutes from "./certificate.routes";
import announcementRoutes from "./announcement.routes";
import blogRoutes from "./blog.routes";
import eventRoutes from "./event.routes";
import submissionRoutes from "./submission.routes";
import centerRoutes from "./center.routes";
import biometricRoutes from "./biometric.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/applicant", applicantRoutes);
router.use("/programs", programRoutes);
router.use("/cohorts", cohortRoutes);
router.use("/registrations", registrationRoutes);
router.use("/certificates", certificateRoutes);
router.use("/announcements", announcementRoutes);
router.use("/blogs", blogRoutes);
router.use("/events", eventRoutes);
router.use("/submissions", submissionRoutes);
router.use("/centers", centerRoutes);
router.use("/biometric", biometricRoutes);

export default router;
