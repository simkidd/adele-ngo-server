import { Router } from "express";
import { createBlogSchema, updateBlogSchema } from "../schemas/blog.schema";
import { asyncHandler } from "../utils/asyncHandler";
import { protectAdmin } from "../middlewares/auth.middleware";
import { restrictTo } from "../middlewares/role.middleware";
import { uploadBlogCover } from "../middlewares/upload.middleware";
import {
  getPublishedPosts,
  getPostBySlug,
  listPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  uploadCoverImage,
} from "../controllers/blog.controller";
import { validate } from "../middlewares/validate.middleware";

const router = Router();

// Public
router.get("/", asyncHandler(getPublishedPosts));
router.get("/slug/:slug", asyncHandler(getPostBySlug));

// Protected
router.use(protectAdmin);
router.use(restrictTo("super_admin", "blog_editor"));

router.get("/admin/all", asyncHandler(listPosts));
router.get("/admin/:id", asyncHandler(getPostById));
router.post("/", validate(createBlogSchema), asyncHandler(createPost));
router.patch("/:id", validate(updateBlogSchema), asyncHandler(updatePost));
router.delete("/:id", asyncHandler(deletePost));
router.post("/:id/cover", uploadBlogCover, asyncHandler(uploadCoverImage));

export default router;
