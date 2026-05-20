import { Document, Types } from "mongoose";
export interface INinData {
    legalName: string;
    dob: string;
    gender: string;
    stateOfOrigin: string;
    photoUrl?: string;
}
export interface IApplicant extends Document {
    email: string;
    password: string;
    refreshToken?: string;
    fullName: string;
    dob: Date;
    gender: "Male" | "Female";
    phone: string;
    whatsapp?: string;
    stateOfOrigin: string;
    lga: string;
    address: string;
    passportPhoto?: string;
    nin: string;
    biometricEnrolled: boolean;
    biometricTemplate?: string;
    biometricEnrolledAt?: Date;
    biometricCenterId?: Types.ObjectId;
    isActive: boolean;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=applicant.interface.d.ts.map