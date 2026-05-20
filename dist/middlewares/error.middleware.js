"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = require("../utils/logger");
const config_1 = require("../config");
const apiError_1 = require("../utils/apiError");
const handleCastError = (err) => new apiError_1.ApiError(`Invalid ${err.path}: ${err.value}`, 400);
const handleDuplicateKeyError = (err) => {
    const field = Object.keys(err.keyValue ?? {})[0];
    return new apiError_1.ApiError(`A record with this ${field} already exists. Please use a different value.`, 409);
};
const handleValidationError = (err) => {
    const messages = err.message.replace("Validation failed: ", "");
    return new apiError_1.ApiError(`Invalid input: ${messages}`, 422);
};
const handleJwtError = () => new apiError_1.ApiError("Invalid token. Please log in again.", 401);
const handleJwtExpiredError = () => new apiError_1.ApiError("Your session has expired. Please log in again.", 401);
const errorHandler = (err, _req, res, _next) => {
    let error = { ...err, message: err.message };
    // Log non-operational errors
    if (!err.isOperational) {
        logger_1.logger.error(err);
    }
    // Mongoose errors
    if (err.name === "CastError")
        error = handleCastError(err);
    if (err.code === 11000)
        error = handleDuplicateKeyError(err);
    if (err.name === "ValidationError")
        error = handleValidationError(err);
    if (err.name === "JsonWebTokenError")
        error = handleJwtError();
    if (err.name === "TokenExpiredError")
        error = handleJwtExpiredError();
    const statusCode = error.statusCode || 500;
    const message = error.message || "Something went wrong. Please try again.";
    res.status(statusCode).json({
        success: false,
        message,
        ...(config_1.config.app.NODE_ENV === "development" && { stack: err.stack }),
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map