import mongoose, { Schema } from "mongoose";
import { IRSVP, IEvent } from "../interfaces/event.interface";

const rsvpSchema = new Schema<IRSVP>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String },
    seats: { type: Number, required: true, min: 1, max: 5, default: 1 },
  },
  { timestamps: true },
);

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["Workshop", "Graduation", "Open Day", "Community"],
    },
    status: {
      type: String,
      enum: ["Upcoming", "Past", "Cancelled"],
      default: "Upcoming",
    },
    centerId: { type: Schema.Types.ObjectId, ref: "Center", required: true },
    capacity: { type: Number, required: true, min: 1 },
    rsvps: [rsvpSchema],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

eventSchema.index({ date: 1, status: 1 });
eventSchema.index({ centerId: 1 });

export const Event = mongoose.model<IEvent>("Event", eventSchema);
