"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../utils/asyncHandler");
const center_controller_1 = require("../controllers/center.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
// Public
router.get("/", (0, asyncHandler_1.asyncHandler)(center_controller_1.listCenters));
router.get("/:id", (0, asyncHandler_1.asyncHandler)(center_controller_1.getCenter));
// Protected — super_admin only
router.use(auth_middleware_1.protectAdmin, (0, role_middleware_1.restrictTo)("super_admin"));
router.patch("/:id", (0, asyncHandler_1.asyncHandler)(center_controller_1.updateCenter));
router.patch("/:id/manager", (0, asyncHandler_1.asyncHandler)(center_controller_1.assignManager));
exports.default = router;
//# sourceMappingURL=center.routes.js.map