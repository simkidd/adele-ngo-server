import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { protectAdmin } from "../middlewares/auth.middleware";
import { restrictTo } from "../middlewares/role.middleware";
import {
  listPrograms,
  getProgram,
  createProgram,
  updateProgram,
  toggleProgramActive,
  assignProgramToCenter,
  removeProgramFromCenter,
} from "../controllers/program.controller";

const router = Router();

// Public
router.get("/", asyncHandler(listPrograms));
router.get("/:id", asyncHandler(getProgram));

// Protected — super_admin only
router.use(protectAdmin, restrictTo("super_admin"));

router.post("/", asyncHandler(createProgram));
router.patch("/:id", asyncHandler(updateProgram));
router.patch("/:id/toggle", asyncHandler(toggleProgramActive));
router.post("/:id/assign-center", asyncHandler(assignProgramToCenter));
router.post("/:id/remove-center", asyncHandler(removeProgramFromCenter));

export default router;
