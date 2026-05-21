import { z } from "zod";
import { slugify } from "../utils/helpers";

export const createBlogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z
    .string()
    .optional()
    .transform((s, ctx) => {
      if (s) return slugify(s);
      const title = (ctx as unknown as { parent: { title: string } })?.parent
        ?.title;
      return title ? slugify(title) : s;
    }),
  excerpt: z
    .string()
    .min(20, "Excerpt must be at least 20 characters")
    .max(300),
  body: z.string().min(100, "Body must be at least 100 characters"),
  category: z.enum(["News", "Programs", "Community", "Impact"]),
  status: z.enum(["Draft", "Published"]).default("Draft"),
  readTime: z.number().int().min(1).max(60).default(3),
});

export const updateBlogSchema = createBlogSchema.partial();

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
