"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scopeToCenter = exports.restrictTo = void 0;
const apiError_1 = require("../utils/apiError");
const restrictTo = (...roles) => {
    return (req, _res, next) => {
        if (!req.user) {
            throw new apiError_1.ApiError("Not authenticated.", 401);
        }
        if (!roles.includes(req.user.role)) {
            throw new apiError_1.ApiError("You do not have permission to perform this action.", 403);
        }
        next();
    };
};
exports.restrictTo = restrictTo;
/**
 * Scopes program_officer to their assigned center only.
 * Checks that the centerId in the request params/body matches
 * the officer's assigned center. super_admin bypasses this.
 */
const scopeToCenter = (req, _res, next) => {
    if (!req.user) {
        throw new apiError_1.ApiError("Not authenticated.", 401);
    }
    if (req.user.role === "super_admin") {
        return next(); // no restriction
    }
    if (req.user.role === "program_officer") {
        const requestedCenter = req.params.centerId ||
            req.query.center ||
            req.body.centerId;
        if (requestedCenter && requestedCenter !== req.user.centerId?.toString()) {
            throw new apiError_1.ApiError("You can only access data for your assigned center.", 403);
        }
        // Inject centerId into query/body for scoped DB queries
        req.query.centerId = req.user.centerId?.toString();
    }
    next();
};
exports.scopeToCenter = scopeToCenter;
//# sourceMappingURL=role.middleware.js.map