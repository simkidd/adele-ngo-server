"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAnnouncementSchema = exports.createAnnouncementSchema = void 0;
const zod_1 = require("zod");
exports.createAnnouncementSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, "Title is required"),
    body: zod_1.z.string().min(10, "Body is required"),
    type: zod_1.z.enum(["General", "Cohort", "Program", "Alert"]).default("General"),
    audience: zod_1.z
        .enum(["Public", "Applicants", "Enrolled", "All"])
        .default("Public"),
    status: zod_1.z.enum(["Draft", "Published"]).default("Draft"),
    centerId: zod_1.z.string().optional().nullable(),
    expiresAt: zod_1.z.string().optional().nullable(),
});
exports.updateAnnouncementSchema = exports.createAnnouncementSchema.partial();
//# sourceMappingURL=announcement.schema.js.map