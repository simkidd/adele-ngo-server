import { Router } from "express";
import {
  createCohortSchema,
  cohortStatusSchema,
} from "../schemas/cohort.schema";
import { asyncHandler } from "../utils/asyncHandler";
import { restrictTo } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  getOpenCohort,
  listCohorts,
  getCohort,
  createCohort,
  updateCohort,
  updateCohortStatus,
} from "../controllers/cohort.controller";
import { protectAdmin } from "../middlewares/auth.middleware";

const router = Router();

// Public — current open cohort (drives the frontend registration form)
router.get("/open", asyncHandler(getOpenCohort));

// Protected
router.use(protectAdmin);

router.get("/", asyncHandler(listCohorts));
router.get("/:id", asyncHandler(getCohort));

// Super admin only — lifecycle management
router.use(restrictTo("super_admin"));

router.post("/", validate(createCohortSchema), asyncHandler(createCohort));
router.patch("/:id", asyncHandler(updateCohort));
router.patch(
  "/:id/status",
  validate(cohortStatusSchema),
  asyncHandler(updateCohortStatus),
);

export default router;
