"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cohort_schema_1 = require("../schemas/cohort.schema");
const asyncHandler_1 = require("../utils/asyncHandler");
const role_middleware_1 = require("../middlewares/role.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const cohort_controller_1 = require("../controllers/cohort.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public — current open cohort (drives the frontend registration form)
router.get("/open", (0, asyncHandler_1.asyncHandler)(cohort_controller_1.getOpenCohort));
// Protected
router.use(auth_middleware_1.protectAdmin);
router.get("/", (0, asyncHandler_1.asyncHandler)(cohort_controller_1.listCohorts));
router.get("/:id", (0, asyncHandler_1.asyncHandler)(cohort_controller_1.getCohort));
// Super admin only — lifecycle management
router.use((0, role_middleware_1.restrictTo)("super_admin"));
router.post("/", (0, validate_middleware_1.validate)(cohort_schema_1.createCohortSchema), (0, asyncHandler_1.asyncHandler)(cohort_controller_1.createCohort));
router.patch("/:id", (0, asyncHandler_1.asyncHandler)(cohort_controller_1.updateCohort));
router.patch("/:id/status", (0, validate_middleware_1.validate)(cohort_schema_1.cohortStatusSchema), (0, asyncHandler_1.asyncHandler)(cohort_controller_1.updateCohortStatus));
exports.default = router;
//# sourceMappingURL=cohort.routes.js.map