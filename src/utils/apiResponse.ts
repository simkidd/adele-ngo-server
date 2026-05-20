import { Response } from "express";

interface ApiResponseOptions {
  success: boolean;
  message: string;
  data?: unknown;
  meta?: Record<string, unknown> | undefined;
}

export const sendResponse = (
  res: Response,
  statusCode: number,
  options: ApiResponseOptions,
): Response => {
  return res.status(statusCode).json({
    success: options.success,
    message: options.message,
    ...(options.data !== undefined && { data: options.data }),
    ...(options.meta !== undefined && { meta: options.meta }),
  });
};

export const sendSuccess = (
  res: Response,
  data: unknown,
  message = "Success",
  statusCode = 200,
  meta?: Record<string, unknown>,
): Response =>
  sendResponse(res, statusCode, { success: true, message, data, meta });

export const sendError = (
  res: Response,
  message: string,
  statusCode = 400,
): Response => sendResponse(res, statusCode, { success: false, message });
