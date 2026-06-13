import { z } from "zod";
export declare const createCohortSchema: z.ZodObject<{
    name: z.ZodString;
    applicationStart: z.ZodString;
    applicationEnd: z.ZodString;
    startDate: z.ZodString;
    endDate: z.ZodString;
    centers: z.ZodArray<z.ZodObject<{
        centerId: z.ZodString;
        programs: z.ZodArray<z.ZodObject<{
            programId: z.ZodString;
            totalSeats: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const updateCohortSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    applicationStart: z.ZodOptional<z.ZodString>;
    applicationEnd: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    centers: z.ZodOptional<z.ZodArray<z.ZodObject<{
        centerId: z.ZodString;
        programs: z.ZodArray<z.ZodObject<{
            programId: z.ZodString;
            totalSeats: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const cohortStatusSchema: z.ZodObject<{
    status: z.ZodEnum<{
        Completed: "Completed";
        Draft: "Draft";
        Open: "Open";
        Closed: "Closed";
        Active: "Active";
    }>;
}, z.core.$strip>;
export type CreateCohortInput = z.infer<typeof createCohortSchema>;
export type UpdateCohortInput = z.infer<typeof updateCohortSchema>;
//# sourceMappingURL=cohort.schema.d.ts.map