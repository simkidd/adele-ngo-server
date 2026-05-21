import { Router } from "express";
import { updateStatusSchema } from "../schemas/registration.schema";
import { asyncHandler } from "../utils/asyncHandler";
import { protectAdmin } from "../middlewares/auth.middleware";
import { scopeToCenter, restrictTo } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  listRegistrations,
  getRegistrationStats,
  getRegistration,
  updateRegistrationStatus,
  deleteRegistration,
} from "../controllers/registration.controller";

const router = Router();

router.use(protectAdmin, scopeToCenter);

router.get("/", asyncHandler(listRegistrations));
router.get("/stats", asyncHandler(getRegistrationStats));
router.get("/:id", asyncHandler(getRegistration));
router.patch(
  "/:id/status",
  validate(updateStatusSchema),
  asyncHandler(updateRegistrationStatus),
);

// Only super_admin or program_officer can delete (drop a slot)
router.delete(
  "/:id",
  restrictTo("super_admin", "program_officer"),
  asyncHandler(deleteRegistration),
);

export default router;
