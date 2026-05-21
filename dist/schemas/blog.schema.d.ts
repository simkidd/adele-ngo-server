import { z } from "zod";
export declare const createBlogSchema: z.ZodObject<{
    title: z.ZodString;
    slug: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string | undefined, string | undefined>>;
    excerpt: z.ZodString;
    body: z.ZodString;
    category: z.ZodEnum<{
        News: "News";
        Programs: "Programs";
        Community: "Community";
        Impact: "Impact";
    }>;
    status: z.ZodDefault<z.ZodEnum<{
        Draft: "Draft";
        Published: "Published";
    }>>;
    readTime: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const updateBlogSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string | undefined, string | undefined>>>;
    excerpt: z.ZodOptional<z.ZodString>;
    body: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodEnum<{
        News: "News";
        Programs: "Programs";
        Community: "Community";
        Impact: "Impact";
    }>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        Draft: "Draft";
        Published: "Published";
    }>>>;
    readTime: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, z.core.$strip>;
export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
//# sourceMappingURL=blog.schema.d.ts.map