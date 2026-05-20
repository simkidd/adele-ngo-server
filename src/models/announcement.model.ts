import mongoose, { Schema } from "mongoose";
import { IAnnouncement } from "../interfaces/annoucement.interface";

const announcementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["General", "Cohort", "Program", "Alert"],
      default: "General",
    },
    audience: {
      type: String,
      required: true,
      enum: ["Public", "Applicants", "Enrolled", "All"],
      default: "Public",
    },
    status: {
      type: String,
      enum: ["Draft", "Published", "Expired"],
      default: "Draft",
    },
    centerId: { type: Schema.Types.ObjectId, ref: "Center", default: null },
    publishedAt: { type: Date },
    expiresAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

announcementSchema.index({ status: 1, audience: 1 });
announcementSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0, partialFilterExpression: { status: "Published" } },
);

export const Announcement = mongoose.model<IAnnouncement>(
  "Announcement",
  announcementSchema,
);
