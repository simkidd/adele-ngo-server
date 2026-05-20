import { z } from "zod";
export declare const createAnnouncementSchema: z.ZodObject<{
    title: z.ZodString;
    body: z.ZodString;
    type: z.ZodDefault<z.ZodEnum<{
        General: "General";
        Cohort: "Cohort";
        Program: "Program";
        Alert: "Alert";
    }>>;
    audience: z.ZodDefault<z.ZodEnum<{
        Public: "Public";
        Applicants: "Applicants";
        Enrolled: "Enrolled";
        All: "All";
    }>>;
    status: z.ZodDefault<z.ZodEnum<{
        Draft: "Draft";
        Published: "Published";
    }>>;
    centerId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    expiresAt: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const updateAnnouncementSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    body: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        General: "General";
        Cohort: "Cohort";
        Program: "Program";
        Alert: "Alert";
    }>>>;
    audience: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        Public: "Public";
        Applicants: "Applicants";
        Enrolled: "Enrolled";
        All: "All";
    }>>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        Draft: "Draft";
        Published: "Published";
    }>>>;
    centerId: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    expiresAt: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
}, z.core.$strip>;
export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;
//# sourceMappingURL=announcement.schema.d.ts.map