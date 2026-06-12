import { Request, Response } from "express";
import { cloudinary } from "../config/cloudinary";
import { BlogPost } from "../models/blog.model";
import { ApiError } from "../utils/apiError";
import { sendSuccess } from "../utils/apiResponse";
import { slugify } from "../utils/helpers";

export const createPost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const slug = req.body.slug || slugify(req.body.title);
  const post = await BlogPost.create({
    ...req.body,
    slug,
    authorId: req.user!._id,
    authorName: req.user!.fullName,
    publishedAt: req.body.status === "Published" ? new Date() : undefined,
  });
  sendSuccess(res, post, "Post created", 201);
};

export const listPosts = async (req: Request, res: Response): Promise<void> => {
  const { category, status, page = "1", limit = "12" } = req.query;
  const filter: Record<string, unknown> = {};
  if (category) filter.category = category;
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const total = await BlogPost.countDocuments(filter);

  const posts = await BlogPost.find(filter)
    .select("-body")
    .sort("-publishedAt -createdAt")
    .skip(skip)
    .limit(Number(limit));

  sendSuccess(res, posts, "OK", 200, {
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
  });
};

export const getPublishedPosts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { category, page = "1", limit = "12" } = req.query;
  const filter: Record<string, unknown> = { status: "Published" };
  if (category) filter.category = category;

  const skip = (Number(page) - 1) * Number(limit);
  const total = await BlogPost.countDocuments(filter);

  const posts = await BlogPost.find(filter)
    .select("-body")
    .sort("-publishedAt")
    .skip(skip)
    .limit(Number(limit));

  sendSuccess(res, posts, "OK", 200, {
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
  });
};

export const getPostBySlug = async (
  req: Request,
  res: Response,
): Promise<void> => {
  // const slug = String(req.params.slug);

  const { slug } = req.params as { slug: string };

  const post = await BlogPost.findOne({
    slug,
    status: "Published",
  });
  if (!post) throw new ApiError("Post not found.", 404);
  sendSuccess(res, post);
};

export const getPostById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) throw new ApiError("Post not found.", 404);
  sendSuccess(res, post);
};

export const updatePost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) throw new ApiError("Post not found.", 404);

  if (req.body.status === "Published" && post.status !== "Published") {
    req.body.publishedAt = new Date();
  }

  const updated = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  sendSuccess(res, updated, "Post updated");
};

export const deletePost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) throw new ApiError("Post not found.", 404);

  if (post.coverPublicId) {
    await cloudinary.uploader.destroy(post.coverPublicId).catch(() => {});
  }

  await BlogPost.findByIdAndDelete(req.params.id);
  sendSuccess(res, null, "Post deleted");
};

export const uploadCoverImage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.file) throw new ApiError("No file uploaded.", 400);

  const file = req.file as Express.Multer.File & {
    path: string;
    filename: string;
  };

  const post = await BlogPost.findByIdAndUpdate(
    req.params.id,
    { coverImage: file.path, coverPublicId: file.filename },
    { new: true },
  );

  if (!post) throw new ApiError("Post not found.", 404);
  sendSuccess(res, { coverImage: file.path }, "Cover image uploaded");
};
