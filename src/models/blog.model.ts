import mongoose, { Schema } from "mongoose";
import { IBlogPost } from "../interfaces/blog.interface";

const blogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: { type: String, required: true, maxlength: 300 },
    body: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["News", "Programs", "Community", "Impact"],
    },
    status: { type: String, enum: ["Draft", "Published"], default: "Draft" },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    authorName: { type: String, required: true },
    coverImage: { type: String, default: "" },
    coverPublicId: { type: String, default: "" },
    readTime: { type: Number, default: 3 },
    publishedAt: { type: Date },
  },
  { timestamps: true },
);

blogPostSchema.index({ status: 1, category: 1 });
blogPostSchema.index({ title: "text", body: "text" });

export const BlogPost = mongoose.model<IBlogPost>("BlogPost", blogPostSchema);
