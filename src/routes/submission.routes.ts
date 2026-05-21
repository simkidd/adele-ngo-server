import { Router } from "express";
import { submissionSchema } from "../schemas/submission.schema";
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../middlewares/validate.middleware";
import { protectAdmin } from "../middlewares/auth.middleware";
import {
  createSubmission,
  deleteSubmission,
  listSubmissions,
  markRead,
} from "../controllers/submission.controller";

const router = Router();

// Public
router.post("/", validate(submissionSchema), asyncHandler(createSubmission));

// Protected
router.use(protectAdmin);

router.get("/", asyncHandler(listSubmissions));
router.patch("/:id/read", asyncHandler(markRead));
router.delete("/:id", asyncHandler(deleteSubmission));

export default router;
