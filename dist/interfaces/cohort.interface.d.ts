import { Document, Types } from "mongoose";
export type CohortStatus = "Draft" | "Open" | "Closed" | "Active" | "Completed";
export interface ICohortProgram {
    programId: Types.ObjectId;
    totalSeats: number;
    enrolledCount: number;
}
export interface ICenterCohort {
    centerId: Types.ObjectId;
    programs: ICohortProgram[];
}
export interface ICohort extends Document {
    name: string;
    applicationStart: Date;
    applicationEnd: Date;
    startDate: Date;
    endDate: Date;
    status: CohortStatus;
    centers: ICenterCohort[];
    createdBy: Types.ObjectId;
    publishedAt?: Date;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=cohort.interface.d.ts.map