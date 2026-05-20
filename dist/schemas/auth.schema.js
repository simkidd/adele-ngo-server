"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicantLoginSchema = exports.createAdminSchema = exports.changePasswordSchema = exports.adminLoginSchema = void 0;
const zod_1 = require("zod");
exports.adminLoginSchema = zod_1.z.object({
    email: zod_1.z.email("Invalid email address"),
    password: zod_1.z.string().min(1, "Password is required"),
});
exports.changePasswordSchema = zod_1.z
    .object({
    currentPassword: zod_1.z.string().min(1, "Current password is required"),
    newPassword: zod_1.z
        .string()
        .min(8, "New password must be at least 8 characters"),
    confirmPassword: zod_1.z.string().min(1, "Please confirm your new password"),
})
    .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
exports.createAdminSchema = zod_1.z
    .object({
    fullName: zod_1.z.string().min(2, "Full name is required"),
    email: zod_1.z.email("Invalid email address"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters"),
    role: zod_1.z.enum(["super_admin", "program_officer", "blog_editor"]),
    centerId: zod_1.z.string().optional(),
})
    .refine((d) => !(d.role === "program_officer" && !d.centerId), {
    message: "Program officer must be assigned to a center",
    path: ["centerId"],
});
exports.applicantLoginSchema = zod_1.z.object({
    email: zod_1.z.email("Invalid email address"),
    password: zod_1.z.string().min(1, "Password is required"),
});
//# sourceMappingURL=auth.schema.js.map