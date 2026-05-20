import { z } from "zod";
export declare const submissionSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodEmail;
    phone: z.ZodOptional<z.ZodString>;
    enquiryType: z.ZodEnum<{
        application: "application";
        volunteer: "volunteer";
        general: "general";
    }>;
    program: z.ZodOptional<z.ZodString>;
    message: z.ZodString;
}, z.core.$strip>;
export type SubmissionInput = z.infer<typeof submissionSchema>;
//# sourceMappingURL=submission.schema.d.ts.map