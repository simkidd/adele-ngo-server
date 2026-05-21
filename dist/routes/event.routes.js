"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const event_schema_1 = require("../schemas/event.schema");
const asyncHandler_1 = require("../utils/asyncHandler");
const event_controller_1 = require("../controllers/event.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const router = (0, express_1.Router)();
// Public
router.get("/public", (0, asyncHandler_1.asyncHandler)(event_controller_1.getPublicEvents));
router.get("/:id", (0, asyncHandler_1.asyncHandler)(event_controller_1.getEvent));
router.post("/:id/rsvp", (0, validate_middleware_1.validate)(event_schema_1.rsvpSchema), (0, asyncHandler_1.asyncHandler)(event_controller_1.createRsvp));
// Protected
router.use(auth_middleware_1.protectAdmin, role_middleware_1.scopeToCenter);
router.get("/", (0, asyncHandler_1.asyncHandler)(event_controller_1.listEvents));
router.post("/", (0, validate_middleware_1.validate)(event_schema_1.createEventSchema), (0, asyncHandler_1.asyncHandler)(event_controller_1.createEvent));
router.patch("/:id", (0, validate_middleware_1.validate)(event_schema_1.updateEventSchema), (0, asyncHandler_1.asyncHandler)(event_controller_1.updateEvent));
router.delete("/:id", (0, asyncHandler_1.asyncHandler)(event_controller_1.deleteEvent));
router.get("/:id/rsvps", (0, asyncHandler_1.asyncHandler)(event_controller_1.getEventRsvps));
exports.default = router;
//# sourceMappingURL=event.routes.js.map