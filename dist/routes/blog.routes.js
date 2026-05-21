"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_schema_1 = require("../schemas/blog.schema");
const asyncHandler_1 = require("../utils/asyncHandler");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const blog_controller_1 = require("../controllers/blog.controller");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const router = (0, express_1.Router)();
// Public
router.get("/", (0, asyncHandler_1.asyncHandler)(blog_controller_1.getPublishedPosts));
router.get("/slug/:slug", (0, asyncHandler_1.asyncHandler)(blog_controller_1.getPostBySlug));
// Protected
router.use(auth_middleware_1.protectAdmin);
router.use((0, role_middleware_1.restrictTo)("super_admin", "blog_editor"));
router.get("/admin/all", (0, asyncHandler_1.asyncHandler)(blog_controller_1.listPosts));
router.get("/admin/:id", (0, asyncHandler_1.asyncHandler)(blog_controller_1.getPostById));
router.post("/", (0, validate_middleware_1.validate)(blog_schema_1.createBlogSchema), (0, asyncHandler_1.asyncHandler)(blog_controller_1.createPost));
router.patch("/:id", (0, validate_middleware_1.validate)(blog_schema_1.updateBlogSchema), (0, asyncHandler_1.asyncHandler)(blog_controller_1.updatePost));
router.delete("/:id", (0, asyncHandler_1.asyncHandler)(blog_controller_1.deletePost));
router.post("/:id/cover", upload_middleware_1.uploadBlogCover, (0, asyncHandler_1.asyncHandler)(blog_controller_1.uploadCoverImage));
exports.default = router;
//# sourceMappingURL=blog.routes.js.map