import { z } from "zod";

export const createAnnouncementSchema = z.object({
  title: z.string().min(3, "Title is required"),
  body: z.string().min(10, "Body is required"),
  type: z.enum(["General", "Cohort", "Program", "Alert"]).default("General"),
  audience: z
    .enum(["Public", "Applicants", "Enrolled", "All"])
    .default("Public"),
  status: z.enum(["Draft", "Published"]).default("Draft"),
  centerId: z.string().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
});

export const updateAnnouncementSchema = createAnnouncementSchema.partial();

export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;
