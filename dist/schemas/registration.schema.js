"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatusSchema = exports.fullRegistrationSchema = exports.registrationStep7Schema = exports.registrationStep6Schema = exports.registrationStep5Schema = exports.registrationStep4Schema = exports.registrationStep3Schema = exports.registrationStep2Schema = exports.ninVerifySchema = void 0;
const zod_1 = require("zod");
const nigerianPhone = zod_1.z
    .string()
    .regex(/^(\+234|0)[789][01]\d{8}$/, "Enter a valid Nigerian phone number");
exports.ninVerifySchema = zod_1.z.object({
    nin: zod_1.z.string().regex(/^\d{11}$/, "NIN must be exactly 11 digits"),
});
exports.registrationStep2Schema = zod_1.z.object({
    phone: nigerianPhone,
    whatsapp: nigerianPhone.optional().or(zod_1.z.literal("")),
    email: zod_1.z.email("Invalid email address"),
    lga: zod_1.z.string().min(2, "LGA is required"),
    address: zod_1.z.string().min(5, "Residential address is required"),
});
exports.registrationStep3Schema = zod_1.z.object({
    centerId: zod_1.z.string().min(1, "Please select a training center"),
    programId: zod_1.z.string().min(1, "Please select a skill area"),
    secondChoiceId: zod_1.z.string().optional(),
});
exports.registrationStep4Schema = zod_1.z.object({
    qualification: zod_1.z.enum([
        "No formal education",
        "Primary School",
        "Junior Secondary (JSS)",
        "Senior Secondary (SSCE/WAEC/NECO)",
        "OND / NCE",
        "HND / B.Sc and above",
        "Vocational/Technical Certificate",
    ]),
    employmentStatus: zod_1.z.enum([
        "Unemployed",
        "Self-employed (informal)",
        "Employed part-time",
        "Employed full-time",
        "Student",
    ]),
    priorExperience: zod_1.z.enum([
        "None",
        "Basic / Self-taught",
        "Intermediate",
        "Advanced",
    ]),
    experienceDetail: zod_1.z.string().optional(),
});
exports.registrationStep5Schema = zod_1.z.object({
    motivation: zod_1.z
        .string()
        .min(50, "Please write at least 50 characters about your motivation"),
    postTrainingPlan: zod_1.z.enum([
        "Get employment in the field",
        "Start my own business",
        "Upgrade existing skills",
        "Other",
    ]),
    referralSource: zod_1.z.enum([
        "Social media",
        "Friend or family referral",
        "Community announcement",
        "School or institution",
        "Government agency",
        "Other",
    ]),
});
exports.registrationStep6Schema = zod_1.z.object({
    specialNeeds: zod_1.z.string().optional(),
    emergencyName: zod_1.z.string().min(2, "Emergency contact name is required"),
    emergencyPhone: nigerianPhone,
    emergencyRelation: zod_1.z
        .string()
        .min(1, "Emergency contact relationship is required"),
});
exports.registrationStep7Schema = zod_1.z
    .object({
    password: zod_1.z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: zod_1.z.string(),
    acceptTerms: zod_1.z.literal(true),
})
    .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
// Full submission schema (all steps combined)
exports.fullRegistrationSchema = zod_1.z
    .object({
    // Step 1 — NIN (verified separately, these come from NIMC)
    nin: zod_1.z.string().regex(/^\d{11}$/, "Invalid NIN"),
    fullName: zod_1.z.string().min(2),
    dob: zod_1.z.string().min(1, "Date of birth is required"),
    gender: zod_1.z.enum(["Male", "Female", "Prefer not to say"]),
    stateOfOrigin: zod_1.z.string().min(2),
    // Step 2
    phone: nigerianPhone,
    whatsapp: nigerianPhone.optional().or(zod_1.z.literal("")),
    email: zod_1.z.email(),
    lga: zod_1.z.string().min(2),
    address: zod_1.z.string().min(5),
    // Step 3
    centerId: zod_1.z.string().min(1),
    programId: zod_1.z.string().min(1),
    secondChoiceId: zod_1.z.string().optional(),
    // Step 4
    qualification: zod_1.z.string().min(1),
    employmentStatus: zod_1.z.string().min(1),
    priorExperience: zod_1.z.string().min(1),
    experienceDetail: zod_1.z.string().optional(),
    // Step 5
    motivation: zod_1.z.string().min(50),
    postTrainingPlan: zod_1.z.string().min(1),
    referralSource: zod_1.z.string().min(1),
    // Step 6
    specialNeeds: zod_1.z.string().optional(),
    emergencyName: zod_1.z.string().min(2),
    emergencyPhone: nigerianPhone,
    emergencyRelation: zod_1.z.string().min(1),
    // Step 7
    password: zod_1.z.string().min(8),
    confirmPassword: zod_1.z.string(),
    acceptTerms: zod_1.z.literal(true),
})
    .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
exports.updateStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["Pending", "Accepted", "Verified", "Enrolled", "Rejected"]),
    adminNotes: zod_1.z.string().optional(),
    verificationDeadline: zod_1.z.string().optional(),
});
//# sourceMappingURL=registration.schema.js.map