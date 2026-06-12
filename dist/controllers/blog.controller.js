"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCoverImage = exports.deletePost = exports.updatePost = exports.getPostById = exports.getPostBySlug = exports.getPublishedPosts = exports.listPosts = exports.createPost = void 0;
const cloudinary_1 = require("../config/cloudinary");
const blog_model_1 = require("../models/blog.model");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const helpers_1 = require("../utils/helpers");
const createPost = async (req, res) => {
    const slug = req.body.slug || (0, helpers_1.slugify)(req.body.title);
    const post = await blog_model_1.BlogPost.create({
        ...req.body,
        slug,
        authorId: req.user._id,
        authorName: req.user.fullName,
        publishedAt: req.body.status === "Published" ? new Date() : undefined,
    });
    (0, apiResponse_1.sendSuccess)(res, post, "Post created", 201);
};
exports.createPost = createPost;
const listPosts = async (req, res) => {
    const { category, status, page = "1", limit = "12" } = req.query;
    const filter = {};
    if (category)
        filter.category = category;
    if (status)
        filter.status = status;
    const skip = (Number(page) - 1) * Number(limit);
    const total = await blog_model_1.BlogPost.countDocuments(filter);
    const posts = await blog_model_1.BlogPost.find(filter)
        .select("-body")
        .sort("-publishedAt -createdAt")
        .skip(skip)
        .limit(Number(limit));
    (0, apiResponse_1.sendSuccess)(res, posts, "OK", 200, {
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
    });
};
exports.listPosts = listPosts;
const getPublishedPosts = async (req, res) => {
    const { category, page = "1", limit = "12" } = req.query;
    const filter = { status: "Published" };
    if (category)
        filter.category = category;
    const skip = (Number(page) - 1) * Number(limit);
    const total = await blog_model_1.BlogPost.countDocuments(filter);
    const posts = await blog_model_1.BlogPost.find(filter)
        .select("-body")
        .sort("-publishedAt")
        .skip(skip)
        .limit(Number(limit));
    (0, apiResponse_1.sendSuccess)(res, posts, "OK", 200, {
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
    });
};
exports.getPublishedPosts = getPublishedPosts;
const getPostBySlug = async (req, res) => {
    // const slug = String(req.params.slug);
    const { slug } = req.params;
    const post = await blog_model_1.BlogPost.findOne({
        slug,
        status: "Published",
    });
    if (!post)
        throw new apiError_1.ApiError("Post not found.", 404);
    (0, apiResponse_1.sendSuccess)(res, post);
};
exports.getPostBySlug = getPostBySlug;
const getPostById = async (req, res) => {
    const post = await blog_model_1.BlogPost.findById(req.params.id);
    if (!post)
        throw new apiError_1.ApiError("Post not found.", 404);
    (0, apiResponse_1.sendSuccess)(res, post);
};
exports.getPostById = getPostById;
const updatePost = async (req, res) => {
    const post = await blog_model_1.BlogPost.findById(req.params.id);
    if (!post)
        throw new apiError_1.ApiError("Post not found.", 404);
    if (req.body.status === "Published" && post.status !== "Published") {
        req.body.publishedAt = new Date();
    }
    const updated = await blog_model_1.BlogPost.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    (0, apiResponse_1.sendSuccess)(res, updated, "Post updated");
};
exports.updatePost = updatePost;
const deletePost = async (req, res) => {
    const post = await blog_model_1.BlogPost.findById(req.params.id);
    if (!post)
        throw new apiError_1.ApiError("Post not found.", 404);
    if (post.coverPublicId) {
        await cloudinary_1.cloudinary.uploader.destroy(post.coverPublicId).catch(() => { });
    }
    await blog_model_1.BlogPost.findByIdAndDelete(req.params.id);
    (0, apiResponse_1.sendSuccess)(res, null, "Post deleted");
};
exports.deletePost = deletePost;
const uploadCoverImage = async (req, res) => {
    if (!req.file)
        throw new apiError_1.ApiError("No file uploaded.", 400);
    const file = req.file;
    const post = await blog_model_1.BlogPost.findByIdAndUpdate(req.params.id, { coverImage: file.path, coverPublicId: file.filename }, { new: true });
    if (!post)
        throw new apiError_1.ApiError("Post not found.", 404);
    (0, apiResponse_1.sendSuccess)(res, { coverImage: file.path }, "Cover image uploaded");
};
exports.uploadCoverImage = uploadCoverImage;
//# sourceMappingURL=blog.controller.js.map