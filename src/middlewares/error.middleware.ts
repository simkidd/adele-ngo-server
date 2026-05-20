import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { config } from "../config";
import { ApiError } from "../utils/apiError";

interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
  path?: string;
  value?: string;
}

const handleCastError = (err: MongoError): ApiError =>
  new ApiError(`Invalid ${err.path}: ${err.value}`, 400);

const handleDuplicateKeyError = (err: MongoError): ApiError => {
  const field = Object.keys(err.keyValue ?? {})[0];
  return new ApiError(
    `A record with this ${field} already exists. Please use a different value.`,
    409,
  );
};

const handleValidationError = (err: MongoError): ApiError => {
  const messages = err.message.replace("Validation failed: ", "");
  return new ApiError(`Invalid input: ${messages}`, 422);
};

const handleJwtError = (): ApiError =>
  new ApiError("Invalid token. Please log in again.", 401);

const handleJwtExpiredError = (): ApiError =>
  new ApiError("Your session has expired. Please log in again.", 401);

export const errorHandler = (
  err: ApiError & MongoError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let error = { ...err, message: err.message };

  // Log non-operational errors
  if (!err.isOperational) {
    logger.error(err);
  }

  // Mongoose errors
  if (err.name === "CastError") error = handleCastError(err);
  if (err.code === 11000) error = handleDuplicateKeyError(err);
  if (err.name === "ValidationError") error = handleValidationError(err);
  if (err.name === "JsonWebTokenError") error = handleJwtError();
  if (err.name === "TokenExpiredError") error = handleJwtExpiredError();

  const statusCode = error.statusCode || 500;
  const message = error.message || "Something went wrong. Please try again.";

  res.status(statusCode).json({
    success: false,
    message,
    ...(config.app.NODE_ENV === "development" && { stack: err.stack }),
  });
};
