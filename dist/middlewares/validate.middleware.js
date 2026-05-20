"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const firstError = result.error.issues?.[0]?.message ?? "Validation failed";
            (0, apiResponse_1.sendError)(res, firstError, 422);
            return;
        }
        req.body = result.data;
        next();
    };
};
exports.validate = validate;
//# sourceMappingURL=validate.middleware.js.map