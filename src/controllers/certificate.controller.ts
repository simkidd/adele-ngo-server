import { Request, Response } from "express";
import { Certificate } from "../models/certificate.model";
import { ApiError } from "../utils/apiError";
import { sendSuccess } from "../utils/apiResponse";
import { issueCertificate } from "../services/cert.service";
import mongoose from "mongoose";

export const issue = async (req: Request, res: Response): Promise<void> => {
  const { registrationId } = req.body;
  if (!registrationId) throw new ApiError("registrationId is required.", 400);

  const certificate = await issueCertificate(
    registrationId,
    req.user!._id.toString(),
  );
  sendSuccess(res, certificate, "Certificate issued successfully", 201);
};

export const verifyCertificate = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { certId } = req.params as { certId: string };
  const cert = await Certificate.findOne({ certId })
    .populate("programId", "title")
    .populate("centerId", "name")
    .populate("cohortId", "name");

  if (!cert) {
    sendSuccess(res, { valid: false, cert: null }, "Certificate not found");
    return;
  }

  sendSuccess(res, {
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

export const listCertificates = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { centerId, programId, page = "1", limit = "20" } = req.query;
  const filter: Record<string, unknown> = {};
  if (centerId)
    filter.centerId = new mongoose.Types.ObjectId(centerId as string);
  if (programId)
    filter.programId = new mongoose.Types.ObjectId(programId as string);

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Certificate.countDocuments(filter);

  const certs = await Certificate.find(filter)
    .populate("programId", "title")
    .populate("centerId", "name code")
    .sort("-issueDate")
    .skip(skip)
    .limit(Number(limit));

  sendSuccess(res, certs, "OK", 200, {
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  });
};
