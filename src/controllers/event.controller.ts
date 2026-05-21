import { Request, Response } from "express";
import { Event } from "../models/event.model";
import { ApiError } from "../utils/apiError";
import { sendSuccess, sendError } from "../utils/apiResponse";
import { sendRsvpConfirmation } from "../services/mail.service";
import mongoose from "mongoose";

export const createEvent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const event = await Event.create({
    ...req.body,
    date: new Date(req.body.date),
    createdBy: req.user!._id,
  });
  sendSuccess(res, event, "Event created", 201);
};

export const listEvents = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { centerId, type, status } = req.query;
  const filter: Record<string, unknown> = {};
  if (centerId)
    filter.centerId = new mongoose.Types.ObjectId(centerId as string);
  if (type) filter.type = type;
  if (status) filter.status = status;

  const events = await Event.find(filter)
    .populate("centerId", "name slug")
    .populate("createdBy", "fullName")
    .sort("date");

  sendSuccess(res, events);
};

export const getPublicEvents = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { centerId } = req.query;
  const filter: Record<string, unknown> = {
    status: { $in: ["Upcoming"] },
  };
  if (centerId)
    filter.centerId = new mongoose.Types.ObjectId(centerId as string);

  const events = await Event.find(filter)
    .populate("centerId", "name slug")
    .sort("date");

  sendSuccess(res, events);
};

export const getEvent = async (req: Request, res: Response): Promise<void> => {
  const event = await Event.findById(req.params.id)
    .populate("centerId", "name address")
    .populate("createdBy", "fullName");
  if (!event) throw new ApiError("Event not found.", 404);
  sendSuccess(res, event);
};

export const updateEvent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!event) throw new ApiError("Event not found.", 404);
  sendSuccess(res, event, "Event updated");
};

export const deleteEvent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) throw new ApiError("Event not found.", 404);
  sendSuccess(res, null, "Event deleted");
};

export const createRsvp = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const event = await Event.findById(req.params.id);
  if (!event) throw new ApiError("Event not found.", 404);
  if (event.status !== "Upcoming") {
    sendError(res, "RSVPs are closed for this event.", 400);
    return;
  }

  const totalRsvped = event.rsvps.reduce((sum, r) => sum + r.seats, 0);
  if (totalRsvped + req.body.seats > event.capacity) {
    sendError(
      res,
      `Only ${event.capacity - totalRsvped} seats remaining.`,
      400,
    );
    return;
  }

  const duplicate = event.rsvps.find(
    (r) => r.email.toLowerCase() === req.body.email.toLowerCase(),
  );
  if (duplicate) {
    sendError(res, "You have already RSVP'd for this event.", 409);
    return;
  }

  event.rsvps.push({
    ...req.body,
    _id: new mongoose.Types.ObjectId(),
    createdAt: new Date(),
  });
  await event.save();

  const dateStr = event.date.toLocaleDateString("en-NG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  sendRsvpConfirmation(
    req.body.email,
    req.body.name,
    event.title,
    dateStr,
    event.time,
    event.location,
    req.body.seats,
  );

  sendSuccess(
    res,
    null,
    "RSVP confirmed. Check your email for confirmation.",
    201,
  );
};

export const getEventRsvps = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const event = await Event.findById(req.params.id).select(
    "rsvps title capacity",
  );
  if (!event) throw new ApiError("Event not found.", 404);
  sendSuccess(res, {
    title: event.title,
    capacity: event.capacity,
    total: event.rsvps.reduce((s, r) => s + r.seats, 0),
    rsvps: event.rsvps,
  });
};
