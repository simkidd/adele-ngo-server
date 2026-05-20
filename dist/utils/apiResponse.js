"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = exports.sendResponse = void 0;
const sendResponse = (res, statusCode, options) => {
    return res.status(statusCode).json({
        success: options.success,
        message: options.message,
        ...(options.data !== undefined && { data: options.data }),
        ...(options.meta !== undefined && { meta: options.meta }),
    });
};
exports.sendResponse = sendResponse;
const sendSuccess = (res, data, message = "Success", statusCode = 200, meta) => (0, exports.sendResponse)(res, statusCode, { success: true, message, data, meta });
exports.sendSuccess = sendSuccess;
const sendError = (res, message, statusCode = 400) => (0, exports.sendResponse)(res, statusCode, { success: false, message });
exports.sendError = sendError;
//# sourceMappingURL=apiResponse.js.map