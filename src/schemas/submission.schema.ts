import { z } from "zod";

export const submissionSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.email("Invalid email address"),
  phone: z.string().optional(),
  enquiryType: z.enum(["application", "volunteer", "general"]),
  program: z.string().optional(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;
