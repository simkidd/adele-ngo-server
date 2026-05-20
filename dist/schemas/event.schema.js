"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEventSchema = exports.rsvpSchema = exports.createEventSchema = void 0;
const zod_1 = require("zod");
exports.createEventSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, "Title is required"),
    description: zod_1.z.string().min(10, "Description is required"),
    date: zod_1.z.string().min(1, "Date is required"),
    time: zod_1.z.string().min(1, "Time is required"),
    location: zod_1.z.string().min(3, "Location is required"),
    type: zod_1.z.enum(["Workshop", "Graduation", "Open Day", "Community"]),
    centerId: zod_1.z.string().min(1, "Center is required"),
    capacity: zod_1.z.number().int().min(1, "Capacity must be at least 1"),
    status: zod_1.z.enum(["Upcoming", "Past", "Cancelled"]).default("Upcoming"),
});
exports.rsvpSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name is required"),
    email: zod_1.z.email("Invalid email address"),
    phone: zod_1.z.string().optional(),
    seats: zod_1.z.number().int().min(1).max(5).default(1),
});
exports.updateEventSchema = exports.createEventSchema.partial();
//# sourceMappingURL=event.schema.js.map