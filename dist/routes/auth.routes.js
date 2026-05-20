"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const auth_schema_1 = require("../schemas/auth.schema");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
// Public
router.post("/login", (0, validate_middleware_1.validate)(auth_schema_1.adminLoginSchema), auth_controller_1.adminLogin);
router.post("/refresh", auth_controller_1.adminRefreshToken);
router.post("/logout", auth_controller_1.adminLogout);
// Protected
router.use(auth_middleware_1.protectAdmin);
router.get("/me", auth_controller_1.getAdminMe);
router.patch("/me", auth_controller_1.updateAdminMe);
router.patch("/me/password", (0, validate_middleware_1.validate)(auth_schema_1.changePasswordSchema), auth_controller_1.changeAdminPassword);
// Super admin only
router.use((0, role_middleware_1.restrictTo)("super_admin"));
router.get("/users", auth_controller_1.listAdminUsers);
router.post("/users", (0, validate_middleware_1.validate)(auth_schema_1.createAdminSchema), auth_controller_1.createAdminUser);
router.delete("/users/:id", auth_controller_1.deactivateAdminUser);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map