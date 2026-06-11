import { z } from "zod";

const nigerianPhone = z
  .string()
  .regex(/^(\+234|0)[789][01]\d{8}$/, "Enter a valid Nigerian phone number");


export const registrationStep2Schema = z.object({
  phone: nigerianPhone,
  whatsapp: nigerianPhone.optional().or(z.literal("")),
  email: z.email("Invalid email address"),
  lga: z.string().min(2, "LGA is required"),
  address: z.string().min(5, "Residential address is required"),
});

export const registrationStep3Schema = z.object({
  centerId: z.string().min(1, "Please select a training center"),
  programId: z.string().min(1, "Please select a skill area"),
  secondChoiceId: z.string().optional(),
});

export const registrationStep4Schema = z.object({
  qualification: z.enum([
    "No formal education",
    "Primary School",
    "Junior Secondary (JSS)",
    "Senior Secondary (SSCE/WAEC/NECO)",
    "OND / NCE",
    "HND / B.Sc and above",
    "Vocational/Technical Certificate",
  ]),
  employmentStatus: z.enum([
    "Unemployed",
    "Self-employed (informal)",
    "Employed part-time",
    "Employed full-time",
    "Student",
  ]),
  priorExperience: z.enum([
    "None",
    "Basic / Self-taught",
    "Intermediate",
    "Advanced",
  ]),
  experienceDetail: z.string().optional(),
});

export const registrationStep5Schema = z.object({
  motivation: z
    .string()
    .min(50, "Please write at least 50 characters about your motivation"),
  postTrainingPlan: z.enum([
    "Get employment in the field",
    "Start my own business",
    "Upgrade existing skills",
    "Other",
  ]),
  referralSource: z.enum([
    "Social media",
    "Friend or family referral",
    "Community announcement",
    "School or institution",
    "Government agency",
    "Other",
  ]),
});

export const registrationStep6Schema = z.object({
  specialNeeds: z.string().optional(),
  emergencyName: z.string().min(2, "Emergency contact name is required"),
  emergencyPhone: nigerianPhone,
  emergencyRelation: z
    .string()
    .min(1, "Emergency contact relationship is required"),
});

export const registrationStep7Schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    acceptTerms: z.literal(true),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Full submission schema (all steps combined)
export const fullRegistrationSchema = z
  .object({
    // Step 1 — NIN (verified separately, these come from NIMC)
    nin: z.string().regex(/^\d{11}$/, "Invalid NIN"),
    fullName: z.string().min(2),
    dob: z.string().min(1, "Date of birth is required"),
    gender: z.enum(["Male", "Female", "Prefer not to say"]),
    stateOfOrigin: z.string().min(2),

    // Step 2
    phone: nigerianPhone,
    whatsapp: nigerianPhone.optional().or(z.literal("")),
    email: z.email(),
    lga: z.string().min(2),
    address: z.string().min(5),

    // Step 3
    centerId: z.string().min(1),
    programId: z.string().min(1),
    secondChoiceId: z.string().optional(),

    // Step 4
    qualification: z.string().min(1),
    employmentStatus: z.string().min(1),
    priorExperience: z.string().min(1),
    experienceDetail: z.string().optional(),

    // Step 5
    motivation: z.string().min(50),
    postTrainingPlan: z.string().min(1),
    referralSource: z.string().min(1),

    // Step 6
    specialNeeds: z.string().optional(),
    emergencyName: z.string().min(2),
    emergencyPhone: nigerianPhone,
    emergencyRelation: z.string().min(1),
    passportPhoto: z.string().optional().or(z.literal("")),

    // Step 7
    password: z.string().min(8),
    confirmPassword: z.string(),
    acceptTerms: z.literal(true),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const updateStatusSchema = z.object({
  status: z.enum(["Pending", "Accepted", "Verified", "Enrolled", "Rejected"]),
  adminNotes: z.string().optional(),
  verificationDeadline: z.string().optional(),
});

export type FullRegistrationInput = z.infer<typeof fullRegistrationSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
