"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../utils/asyncHandler");
const certificate_controller_1 = require("../controllers/certificate.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
// Public — certificate verification (QR scan lands here)
router.get("/verify/:certId", (0, asyncHandler_1.asyncHandler)(certificate_controller_1.verifyCertificate));
// Protected
router.use(auth_middleware_1.protectAdmin, role_middleware_1.scopeToCenter);
router.get("/", (0, asyncHandler_1.asyncHandler)(certificate_controller_1.listCertificates));
router.post("/issue", (0, role_middleware_1.restrictTo)("super_admin", "program_officer"), (0, asyncHandler_1.asyncHandler)(certificate_controller_1.issue));
exports.default = router;
//# sourceMappingURL=certificate.routes.js.map