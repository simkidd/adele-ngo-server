"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cohortStatusSchema = exports.updateCohortSchema = exports.createCohortSchema = void 0;
const zod_1 = require("zod");
const centerProgramSchema = zod_1.z.object({
    programId: zod_1.z.string().min(1, "Program ID is required"),
    totalSeats: zod_1.z.number().int().min(1, "Seats must be at least 1"),
});
const centerCohortSchema = zod_1.z.object({
    centerId: zod_1.z.string().min(1, "Center ID is required"),
    programs: zod_1.z
        .array(centerProgramSchema)
        .min(1, "At least one program is required"),
});
exports.createCohortSchema = zod_1.z
    .object({
    name: zod_1.z.string().min(3, "Cohort name is required"),
    applicationStart: zod_1.z.string().min(1, "Application start date is required"),
    applicationEnd: zod_1.z.string().min(1, "Application end date is required"),
    startDate: zod_1.z.string().min(1, "Training start date is required"),
    endDate: zod_1.z.string().min(1, "Training end date is required"),
    centers: zod_1.z
        .array(centerCohortSchema)
        .min(1, "At least one center must be configured"),
})
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
exports.updateCohortSchema = exports.createCohortSchema.partial();
exports.cohortStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["Draft", "Open", "Closed", "Active", "Completed"]),
});
//# sourceMappingURL=cohort.schema.js.map