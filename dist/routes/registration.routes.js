"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const registration_schema_1 = require("../schemas/registration.schema");
const asyncHandler_1 = require("../utils/asyncHandler");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const registration_controller_1 = require("../controllers/registration.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protectAdmin, role_middleware_1.scopeToCenter);
router.get("/", (0, asyncHandler_1.asyncHandler)(registration_controller_1.listRegistrations));
router.get("/stats", (0, asyncHandler_1.asyncHandler)(registration_controller_1.getRegistrationStats));
router.get("/:id", (0, asyncHandler_1.asyncHandler)(registration_controller_1.getRegistration));
router.patch("/:id/status", (0, validate_middleware_1.validate)(registration_schema_1.updateStatusSchema), (0, asyncHandler_1.asyncHandler)(registration_controller_1.updateRegistrationStatus));
// Only super_admin or program_officer can delete (drop a slot)
router.delete("/:id", (0, role_middleware_1.restrictTo)("super_admin", "program_officer"), (0, asyncHandler_1.asyncHandler)(registration_controller_1.deleteRegistration));
exports.default = router;
//# sourceMappingURL=registration.routes.js.map