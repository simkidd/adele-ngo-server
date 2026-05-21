"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const submission_schema_1 = require("../schemas/submission.schema");
const asyncHandler_1 = require("../utils/asyncHandler");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const submission_controller_1 = require("../controllers/submission.controller");
const router = (0, express_1.Router)();
// Public
router.post("/", (0, validate_middleware_1.validate)(submission_schema_1.submissionSchema), (0, asyncHandler_1.asyncHandler)(submission_controller_1.createSubmission));
// Protected
router.use(auth_middleware_1.protectAdmin);
router.get("/", (0, asyncHandler_1.asyncHandler)(submission_controller_1.listSubmissions));
router.patch("/:id/read", (0, asyncHandler_1.asyncHandler)(submission_controller_1.markRead));
router.delete("/:id", (0, asyncHandler_1.asyncHandler)(submission_controller_1.deleteSubmission));
exports.default = router;
//# sourceMappingURL=submission.routes.js.map