import { z } from "zod";

const centerProgramSchema = z.object({
  programId: z.string().min(1, "Program ID is required"),
  totalSeats: z.number().int().min(1, "Seats must be at least 1"),
});

const centerCohortSchema = z.object({
  centerId: z.string().min(1, "Center ID is required"),
  programs: z
    .array(centerProgramSchema)
    .min(1, "At least one program is required"),
});

const cohortBaseSchema = z.object({
  name: z.string().min(3, "Cohort name is required"),
  applicationStart: z.string().min(1, "Application start date is required"),
  applicationEnd: z.string().min(1, "Application end date is required"),
  startDate: z.string().min(1, "Training start date is required"),
  endDate: z.string().min(1, "Training end date is required"),
  centers: z
    .array(centerCohortSchema)
    .min(1, "At least one center must be configured"),
});

export const createCohortSchema = cohortBaseSchema
  .refine((d) => new Date(d.applicationEnd) > new Date(d.applicationStart), {
    message: "Application end date must be after start date",
    path: ["applicationEnd"],
  })
  .refine((d) => new Date(d.startDate) >= new Date(d.applicationEnd), {
    message: "Training start date must be on or after application end date",
    path: ["startDate"],
  })
  .refine((d) => new Date(d.endDate) > new Date(d.startDate), {
    message: "Training end date must be after start date",
    path: ["endDate"],
  });

export const updateCohortSchema = cohortBaseSchema.partial().refine((d) => {
  if (!d.applicationStart || !d.applicationEnd) return true;
  return new Date(d.applicationEnd) > new Date(d.applicationStart);
});

export const cohortStatusSchema = z.object({
  status: z.enum(["Draft", "Open", "Closed", "Active", "Completed"]),
});

export type CreateCohortInput = z.infer<typeof createCohortSchema>;
export type UpdateCohortInput = z.infer<typeof updateCohortSchema>;
