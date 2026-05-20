import mongoose, { Document, Schema } from "mongoose";

export type EventType = "Workshop" | "Graduation" | "Open Day" | "Community";
export type EventStatus = "Upcoming" | "Past" | "Cancelled";

export interface IRSVP {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  seats: number;
  createdAt: Date;
}

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  type: EventType;
  status: EventStatus;
  centerId: mongoose.Types.ObjectId;
  capacity: number;
  rsvps: IRSVP[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
