import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";
import { AdminRole } from "../interfaces/user.interface";
import { AuthRequest } from "./auth.middleware";

export const restrictTo = (...roles: AdminRole[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new ApiError("Not authenticated.", 401);
    }
    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        "You do not have permission to perform this action.",
        403,
      );
    }
    next();
  };
};

/**
 * Scopes program_officer to their assigned center only.
 * Checks that the centerId in the request params/body matches
 * the officer's assigned center. super_admin bypasses this.
 */
export const scopeToCenter = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    throw new ApiError("Not authenticated.", 401);
  }

  if (req.user.role === "super_admin") {
    return next(); // no restriction
  }

  if (req.user.role === "program_officer") {
    const requestedCenter =
      (req.params.centerId as string) ||
      (req.query.center as string) ||
      (req.body.centerId as string);

    if (requestedCenter && requestedCenter !== req.user.centerId?.toString()) {
      throw new ApiError(
        "You can only access data for your assigned center.",
        403,
      );
    }

    // Inject centerId into query/body for scoped DB queries
    req.query.centerId = req.user.centerId?.toString();
  }

  next();
};
