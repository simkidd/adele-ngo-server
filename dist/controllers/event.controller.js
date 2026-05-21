"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventRsvps = exports.createRsvp = exports.deleteEvent = exports.updateEvent = exports.getEvent = exports.getPublicEvents = exports.listEvents = exports.createEvent = void 0;
const event_model_1 = require("../models/event.model");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const mail_service_1 = require("../services/mail.service");
const mongoose_1 = __importDefault(require("mongoose"));
const createEvent = async (req, res) => {
    const event = await event_model_1.Event.create({
        ...req.body,
        date: new Date(req.body.date),
        createdBy: req.user._id,
    });
    (0, apiResponse_1.sendSuccess)(res, event, "Event created", 201);
};
exports.createEvent = createEvent;
const listEvents = async (req, res) => {
    const { centerId, type, status } = req.query;
    const filter = {};
    if (centerId)
        filter.centerId = new mongoose_1.default.Types.ObjectId(centerId);
    if (type)
        filter.type = type;
    if (status)
        filter.status = status;
    const events = await event_model_1.Event.find(filter)
        .populate("centerId", "name slug")
        .populate("createdBy", "fullName")
        .sort("date");
    (0, apiResponse_1.sendSuccess)(res, events);
};
exports.listEvents = listEvents;
const getPublicEvents = async (req, res) => {
    const { centerId } = req.query;
    const filter = {
        status: { $in: ["Upcoming"] },
    };
    if (centerId)
        filter.centerId = new mongoose_1.default.Types.ObjectId(centerId);
    const events = await event_model_1.Event.find(filter)
        .populate("centerId", "name slug")
        .sort("date");
    (0, apiResponse_1.sendSuccess)(res, events);
};
exports.getPublicEvents = getPublicEvents;
const getEvent = async (req, res) => {
    const event = await event_model_1.Event.findById(req.params.id)
        .populate("centerId", "name address")
        .populate("createdBy", "fullName");
    if (!event)
        throw new apiError_1.ApiError("Event not found.", 404);
    (0, apiResponse_1.sendSuccess)(res, event);
};
exports.getEvent = getEvent;
const updateEvent = async (req, res) => {
    const event = await event_model_1.Event.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    if (!event)
        throw new apiError_1.ApiError("Event not found.", 404);
    (0, apiResponse_1.sendSuccess)(res, event, "Event updated");
};
exports.updateEvent = updateEvent;
const deleteEvent = async (req, res) => {
    const event = await event_model_1.Event.findByIdAndDelete(req.params.id);
    if (!event)
        throw new apiError_1.ApiError("Event not found.", 404);
    (0, apiResponse_1.sendSuccess)(res, null, "Event deleted");
};
exports.deleteEvent = deleteEvent;
const createRsvp = async (req, res) => {
    const event = await event_model_1.Event.findById(req.params.id);
    if (!event)
        throw new apiError_1.ApiError("Event not found.", 404);
    if (event.status !== "Upcoming") {
        (0, apiResponse_1.sendError)(res, "RSVPs are closed for this event.", 400);
        return;
    }
    const totalRsvped = event.rsvps.reduce((sum, r) => sum + r.seats, 0);
    if (totalRsvped + req.body.seats > event.capacity) {
        (0, apiResponse_1.sendError)(res, `Only ${event.capacity - totalRsvped} seats remaining.`, 400);
        return;
    }
    const duplicate = event.rsvps.find((r) => r.email.toLowerCase() === req.body.email.toLowerCase());
    if (duplicate) {
        (0, apiResponse_1.sendError)(res, "You have already RSVP'd for this event.", 409);
        return;
    }
    event.rsvps.push({
        ...req.body,
        _id: new mongoose_1.default.Types.ObjectId(),
        createdAt: new Date(),
    });
    await event.save();
    const dateStr = event.date.toLocaleDateString("en-NG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    (0, mail_service_1.sendRsvpConfirmation)(req.body.email, req.body.name, event.title, dateStr, event.time, event.location, req.body.seats);
    (0, apiResponse_1.sendSuccess)(res, null, "RSVP confirmed. Check your email for confirmation.", 201);
};
exports.createRsvp = createRsvp;
const getEventRsvps = async (req, res) => {
    const event = await event_model_1.Event.findById(req.params.id).select("rsvps title capacity");
    if (!event)
        throw new apiError_1.ApiError("Event not found.", 404);
    (0, apiResponse_1.sendSuccess)(res, {
        title: event.title,
        capacity: event.capacity,
        total: event.rsvps.reduce((s, r) => s + r.seats, 0),
        rsvps: event.rsvps,
    });
};
exports.getEventRsvps = getEventRsvps;
//# sourceMappingURL=event.controller.js.map