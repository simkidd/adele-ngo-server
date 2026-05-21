"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const announcement_controller_1 = require("../controllers/announcement.controller");
const announcement_schema_1 = require("../schemas/announcement.schema");
const asyncHandler_1 = require("../utils/asyncHandler");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const router = (0, express_1.Router)();
// Public
router.get("/public", (0, asyncHandler_1.asyncHandler)(announcement_controller_1.getPublicAnnouncements));
// Protected
router.use(auth_middleware_1.protectAdmin);
router.get("/", (0, asyncHandler_1.asyncHandler)(announcement_controller_1.listAnnouncements));
router.post("/", (0, validate_middleware_1.validate)(announcement_schema_1.createAnnouncementSchema), (0, asyncHandler_1.asyncHandler)(announcement_controller_1.createAnnouncement));
router.patch("/:id", (0, validate_middleware_1.validate)(announcement_schema_1.updateAnnouncementSchema), (0, asyncHandler_1.asyncHandler)(announcement_controller_1.updateAnnouncement));
router.delete("/:id", (0, asyncHandler_1.asyncHandler)(announcement_controller_1.deleteAnnouncement));
exports.default = router;
//# sourceMappingURL=announcement.routes.js.map