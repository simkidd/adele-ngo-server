import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  listCenters,
  getCenter,
  updateCenter,
  assignManager,
} from "../controllers/center.controller";
import { protectAdmin } from "../middlewares/auth.middleware";
import { restrictTo } from "../middlewares/role.middleware";

const router = Router();

// Public
router.get("/", asyncHandler(listCenters));
router.get("/:id", asyncHandler(getCenter));

// Protected — super_admin only
router.use(protectAdmin, restrictTo("super_admin"));

router.patch("/:id", asyncHandler(updateCenter));
router.patch("/:id/manager", asyncHandler(assignManager));

export default router;
