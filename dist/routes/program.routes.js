"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../utils/asyncHandler");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const program_controller_1 = require("../controllers/program.controller");
const router = (0, express_1.Router)();
// Public
router.get("/", (0, asyncHandler_1.asyncHandler)(program_controller_1.listPrograms));
router.get("/:id", (0, asyncHandler_1.asyncHandler)(program_controller_1.getProgram));
// Protected — super_admin only
router.use(auth_middleware_1.protectAdmin, (0, role_middleware_1.restrictTo)("super_admin"));
router.post("/", (0, asyncHandler_1.asyncHandler)(program_controller_1.createProgram));
router.patch("/:id", (0, asyncHandler_1.asyncHandler)(program_controller_1.updateProgram));
router.patch("/:id/toggle", (0, asyncHandler_1.asyncHandler)(program_controller_1.toggleProgramActive));
router.post("/:id/assign-center", (0, asyncHandler_1.asyncHandler)(program_controller_1.assignProgramToCenter));
router.post("/:id/remove-center", (0, asyncHandler_1.asyncHandler)(program_controller_1.removeProgramFromCenter));
exports.default = router;
//# sourceMappingURL=program.routes.js.map