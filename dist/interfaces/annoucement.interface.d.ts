import mongoose, { Document } from "mongoose";
export type AnnouncementType = "General" | "Cohort" | "Program" | "Alert";
export type AnnouncementAudience = "Public" | "Applicants" | "Enrolled" | "All";
export type AnnouncementStatus = "Draft" | "Published" | "Expired";
export interface IAnnouncement extends Document {
    title: string;
    body: string;
    type: AnnouncementType;
    audience: AnnouncementAudience;
    status: AnnouncementStatus;
    centerId?: mongoose.Types.ObjectId;
    publishedAt?: Date;
    expiresAt?: Date;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=annoucement.interface.d.ts.map