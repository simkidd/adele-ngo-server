import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { protectAdmin } from "../middlewares/auth.middleware";
import { scopeToCenter, restrictTo } from "../middlewares/role.middleware";
import {
  pendingBiometrics,
  enroll,
  verify,
  status,
} from "../controllers/biometric.controller";

const router = Router();

router.use(protectAdmin, scopeToCenter);
router.use(restrictTo("super_admin", "program_officer"));

router.get("/pending", asyncHandler(pendingBiometrics));
router.get("/status/:applicantId", asyncHandler(status));
router.post("/enroll", asyncHandler(enroll));
router.post("/verify", asyncHandler(verify));

export default router;
