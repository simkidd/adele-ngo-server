import { z } from "zod";
export declare const createEventSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    date: z.ZodString;
    time: z.ZodString;
    location: z.ZodString;
    type: z.ZodEnum<{
        Community: "Community";
        Workshop: "Workshop";
        Graduation: "Graduation";
        "Open Day": "Open Day";
    }>;
    centerId: z.ZodString;
    capacity: z.ZodNumber;
    status: z.ZodDefault<z.ZodEnum<{
        Upcoming: "Upcoming";
        Past: "Past";
        Cancelled: "Cancelled";
    }>>;
}, z.core.$strip>;
export declare const rsvpSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodEmail;
    phone: z.ZodOptional<z.ZodString>;
    seats: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const updateEventSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    date: z.ZodOptional<z.ZodString>;
    time: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<{
        Community: "Community";
        Workshop: "Workshop";
        Graduation: "Graduation";
        "Open Day": "Open Day";
    }>>;
    centerId: z.ZodOptional<z.ZodString>;
    capacity: z.ZodOptional<z.ZodNumber>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        Upcoming: "Upcoming";
        Past: "Past";
        Cancelled: "Cancelled";
    }>>>;
}, z.core.$strip>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type RsvpInput = z.infer<typeof rsvpSchema>;
//# sourceMappingURL=event.schema.d.ts.map