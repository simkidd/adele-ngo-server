import { Router } from "express";
import {
  createAnnouncement,
  listAnnouncements,
  getPublicAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcement.controller";
import {
  createAnnouncementSchema,
  updateAnnouncementSchema,
} from "../schemas/announcement.schema";
import { asyncHandler } from "../utils/asyncHandler";
import { protectAdmin } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";

const router = Router();

// Public
router.get("/public", asyncHandler(getPublicAnnouncements));

// Protected
router.use(protectAdmin);

router.get("/", asyncHandler(listAnnouncements));
router.post(
  "/",
  validate(createAnnouncementSchema),
  asyncHandler(createAnnouncement),
);
router.patch(
  "/:id",
  validate(updateAnnouncementSchema),
  asyncHandler(updateAnnouncement),
);
router.delete("/:id", asyncHandler(deleteAnnouncement));

export default router;
