import mongoose, { Document } from "mongoose";

export type BlogCategory = "News" | "Programs" | "Community" | "Impact";
export type BlogStatus = "Draft" | "Published";

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: BlogCategory;
  status: BlogStatus;
  authorId: mongoose.Types.ObjectId;
  authorName: string;
  coverImage: string;
  coverPublicId: string;
  readTime: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
