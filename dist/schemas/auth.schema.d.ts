import { z } from "zod";
export declare const adminLoginSchema: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strip>;
export declare const changePasswordSchema: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
    confirmPassword: z.ZodString;
}, z.core.$strip>;
export declare const createAdminSchema: z.ZodObject<{
    fullName: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
    role: z.ZodEnum<{
        super_admin: "super_admin";
        program_officer: "program_officer";
        blog_editor: "blog_editor";
    }>;
    centerId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const applicantLoginSchema: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strip>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type ApplicantLoginInput = z.infer<typeof applicantLoginSchema>;
//# sourceMappingURL=auth.schema.d.ts.map