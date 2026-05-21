"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../utils/asyncHandler");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const biometric_controller_1 = require("../controllers/biometric.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protectAdmin, role_middleware_1.scopeToCenter);
router.use((0, role_middleware_1.restrictTo)("super_admin", "program_officer"));
router.get("/pending", (0, asyncHandler_1.asyncHandler)(biometric_controller_1.pendingBiometrics));
router.get("/status/:applicantId", (0, asyncHandler_1.asyncHandler)(biometric_controller_1.status));
router.post("/enroll", (0, asyncHandler_1.asyncHandler)(biometric_controller_1.enroll));
router.post("/verify", (0, asyncHandler_1.asyncHandler)(biometric_controller_1.verify));
exports.default = router;
//# sourceMappingURL=biometric.routes.js.map