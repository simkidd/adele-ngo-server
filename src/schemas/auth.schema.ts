import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const createAdminSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["super_admin", "program_officer", "blog_editor"]),
    centerId: z.string().optional(),
  })
  .refine((d) => !(d.role === "program_officer" && !d.centerId), {
    message: "Program officer must be assigned to a center",
    path: ["centerId"],
  });

export const applicantLoginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type ApplicantLoginInput = z.infer<typeof applicantLoginSchema>;
