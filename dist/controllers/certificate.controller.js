"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCertificates = exports.verifyCertificate = exports.issue = void 0;
const certificate_model_1 = require("../models/certificate.model");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const cert_service_1 = require("../services/cert.service");
const mongoose_1 = __importDefault(require("mongoose"));
const issue = async (req, res) => {
    const { registrationId } = req.body;
    if (!registrationId)
        throw new apiError_1.ApiError("registrationId is required.", 400);
    const certificate = await (0, cert_service_1.issueCertificate)(registrationId, req.user._id.toString());
    (0, apiResponse_1.sendSuccess)(res, certificate, "Certificate issued successfully", 201);
};
exports.issue = issue;
const verifyCertificate = async (req, res) => {
    const { certId } = req.params;
    const cert = await certificate_model_1.Certificate.findOne({ certId })
        .populate("programId", "title")
        .populate("centerId", "name")
        .populate("cohortId", "name");
    if (!cert) {
        (0, apiResponse_1.sendSuccess)(res, { valid: false, cert: null }, "Certificate not found");
        return;
    }
    (0, apiResponse_1.sendSuccess)(res, {
        valid: true,
        cert: {
            certId: cert.certId,
            graduateName: cert.graduateName,
            programTitle: cert.programTitle,
            centerName: cert.centerName,
            cohortName: cert.cohortName,
            trainingStart: cert.trainingStart,
            trainingEnd: cert.trainingEnd,
            issueDate: cert.issueDate,
            qrCodeUrl: cert.qrCodeUrl,
            pdfUrl: cert.pdfUrl,
        },
    });
};
exports.verifyCertificate = verifyCertificate;
const listCertificates = async (req, res) => {
    const { centerId, programId, page = "1", limit = "20" } = req.query;
    const filter = {};
    if (centerId)
        filter.centerId = new mongoose_1.default.Types.ObjectId(centerId);
    if (programId)
        filter.programId = new mongoose_1.default.Types.ObjectId(programId);
    const skip = (Number(page) - 1) * Number(limit);
    const total = await certificate_model_1.Certificate.countDocuments(filter);
    const certs = await certificate_model_1.Certificate.find(filter)
        .populate("programId", "title")
        .populate("centerId", "name code")
        .sort("-issueDate")
        .skip(skip)
        .limit(Number(limit));
    (0, apiResponse_1.sendSuccess)(res, certs, "OK", 200, {
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
    });
};
exports.listCertificates = listCertificates;
//# sourceMappingURL=certificate.controller.js.map