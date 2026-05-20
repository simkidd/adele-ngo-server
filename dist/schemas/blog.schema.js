"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogSchema = exports.createBlogSchema = exports.slugify = void 0;
const zod_1 = require("zod");
const slugify = (s) => s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
exports.slugify = slugify;
exports.createBlogSchema = zod_1.z.object({
    title: zod_1.z.string().min(5, "Title must be at least 5 characters"),
    slug: zod_1.z
        .string()
        .optional()
        .transform((s, ctx) => {
        if (s)
            return (0, exports.slugify)(s);
        const title = ctx?.parent
            ?.title;
        return title ? (0, exports.slugify)(title) : s;
    }),
    excerpt: zod_1.z
        .string()
        .min(20, "Excerpt must be at least 20 characters")
        .max(300),
    body: zod_1.z.string().min(100, "Body must be at least 100 characters"),
    category: zod_1.z.enum(["News", "Programs", "Community", "Impact"]),
    status: zod_1.z.enum(["Draft", "Published"]).default("Draft"),
    readTime: zod_1.z.number().int().min(1).max(60).default(3),
});
exports.updateBlogSchema = exports.createBlogSchema.partial();
//# sourceMappingURL=blog.schema.js.map