import { z } from "zod";
export declare const registrationStep2Schema: z.ZodObject<{
    phone: z.ZodString;
    whatsapp: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    email: z.ZodEmail;
    lga: z.ZodString;
    address: z.ZodString;
}, z.core.$strip>;
export declare const registrationStep3Schema: z.ZodObject<{
    centerId: z.ZodString;
    programId: z.ZodString;
    secondChoiceId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const registrationStep4Schema: z.ZodObject<{
    qualification: z.ZodEnum<{
        "No formal education": "No formal education";
        "Primary School": "Primary School";
        "Junior Secondary (JSS)": "Junior Secondary (JSS)";
        "Senior Secondary (SSCE/WAEC/NECO)": "Senior Secondary (SSCE/WAEC/NECO)";
        "OND / NCE": "OND / NCE";
        "HND / B.Sc and above": "HND / B.Sc and above";
        "Vocational/Technical Certificate": "Vocational/Technical Certificate";
    }>;
    employmentStatus: z.ZodEnum<{
        Unemployed: "Unemployed";
        "Self-employed (informal)": "Self-employed (informal)";
        "Employed part-time": "Employed part-time";
        "Employed full-time": "Employed full-time";
        Student: "Student";
    }>;
    priorExperience: z.ZodEnum<{
        None: "None";
        "Basic / Self-taught": "Basic / Self-taught";
        Intermediate: "Intermediate";
        Advanced: "Advanced";
    }>;
    experienceDetail: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const registrationStep5Schema: z.ZodObject<{
    motivation: z.ZodString;
    postTrainingPlan: z.ZodEnum<{
        "Get employment in the field": "Get employment in the field";
        "Start my own business": "Start my own business";
        "Upgrade existing skills": "Upgrade existing skills";
        Other: "Other";
    }>;
    referralSource: z.ZodEnum<{
        Other: "Other";
        "Social media": "Social media";
        "Friend or family referral": "Friend or family referral";
        "Community announcement": "Community announcement";
        "School or institution": "School or institution";
        "Government agency": "Government agency";
    }>;
}, z.core.$strip>;
export declare const registrationStep6Schema: z.ZodObject<{
    specialNeeds: z.ZodOptional<z.ZodString>;
    emergencyName: z.ZodString;
    emergencyPhone: z.ZodString;
    emergencyRelation: z.ZodString;
}, z.core.$strip>;
export declare const registrationStep7Schema: z.ZodObject<{
    password: z.ZodString;
    confirmPassword: z.ZodString;
    acceptTerms: z.ZodLiteral<true>;
}, z.core.$strip>;
export declare const fullRegistrationSchema: z.ZodObject<{
    nin: z.ZodString;
    fullName: z.ZodString;
    dob: z.ZodString;
    gender: z.ZodEnum<{
        Male: "Male";
        Female: "Female";
        "Prefer not to say": "Prefer not to say";
    }>;
    stateOfOrigin: z.ZodString;
    phone: z.ZodString;
    whatsapp: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    email: z.ZodEmail;
    lga: z.ZodString;
    address: z.ZodString;
    centerId: z.ZodString;
    programId: z.ZodString;
    secondChoiceId: z.ZodOptional<z.ZodString>;
    qualification: z.ZodString;
    employmentStatus: z.ZodString;
    priorExperience: z.ZodString;
    experienceDetail: z.ZodOptional<z.ZodString>;
    motivation: z.ZodString;
    postTrainingPlan: z.ZodString;
    referralSource: z.ZodString;
    specialNeeds: z.ZodOptional<z.ZodString>;
    emergencyName: z.ZodString;
    emergencyPhone: z.ZodString;
    emergencyRelation: z.ZodString;
    passportPhoto: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    password: z.ZodString;
    confirmPassword: z.ZodString;
    acceptTerms: z.ZodLiteral<true>;
}, z.core.$strip>;
export declare const updateStatusSchema: z.ZodObject<{
    status: z.ZodEnum<{
        Pending: "Pending";
        Accepted: "Accepted";
        Verified: "Verified";
        Enrolled: "Enrolled";
        Rejected: "Rejected";
    }>;
    adminNotes: z.ZodOptional<z.ZodString>;
    verificationDeadline: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type FullRegistrationInput = z.infer<typeof fullRegistrationSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
//# sourceMappingURL=registration.schema.d.ts.map