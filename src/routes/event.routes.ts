import { Router } from "express";
import {
  createEventSchema,
  rsvpSchema,
  updateEventSchema,
} from "../schemas/event.schema";
import { asyncHandler } from "../utils/asyncHandler";
import {
  getPublicEvents,
  getEvent,
  createRsvp,
  listEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventRsvps,
} from "../controllers/event.controller";
import { protectAdmin } from "../middlewares/auth.middleware";
import { scopeToCenter } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";

const router = Router();

// Public
router.get("/public", asyncHandler(getPublicEvents));
router.get("/:id", asyncHandler(getEvent));
router.post("/:id/rsvp", validate(rsvpSchema), asyncHandler(createRsvp));

// Protected
router.use(protectAdmin, scopeToCenter);

router.get("/", asyncHandler(listEvents));
router.post("/", validate(createEventSchema), asyncHandler(createEvent));
router.patch("/:id", validate(updateEventSchema), asyncHandler(updateEvent));
router.delete("/:id", asyncHandler(deleteEvent));
router.get("/:id/rsvps", asyncHandler(getEventRsvps));

export default router;
