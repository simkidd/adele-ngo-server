import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(3, "Location is required"),
  type: z.enum(["Workshop", "Graduation", "Open Day", "Community"]),
  centerId: z.string().min(1, "Center is required"),
  capacity: z.number().int().min(1, "Capacity must be at least 1"),
  status: z.enum(["Upcoming", "Past", "Cancelled"]).default("Upcoming"),
});

export const rsvpSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.email("Invalid email address"),
  phone: z.string().optional(),
  seats: z.number().int().min(1).max(5).default(1),
});

export const updateEventSchema = createEventSchema.partial();

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type RsvpInput = z.infer<typeof rsvpSchema>;
