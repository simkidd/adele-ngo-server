import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  verifyCertificate,
  listCertificates,
  issue,
} from "../controllers/certificate.controller";
import { protectAdmin } from "../middlewares/auth.middleware";
import { scopeToCenter, restrictTo } from "../middlewares/role.middleware";

const router = Router();

// Public — certificate verification (QR scan lands here)
router.get("/verify/:certId", asyncHandler(verifyCertificate));

// Protected
router.use(protectAdmin, scopeToCenter);

router.get("/", asyncHandler(listCertificates));
router.post(
  "/issue",
  restrictTo("super_admin", "program_officer"),
  asyncHandler(issue),
);

export default router;
