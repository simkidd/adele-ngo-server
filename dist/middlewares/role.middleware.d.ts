import { Response, NextFunction } from "express";
import { AdminRole } from "../interfaces/user.interface";
import { AuthRequest } from "./auth.middleware";
export declare const restrictTo: (...roles: AdminRole[]) => (req: AuthRequest, _res: Response, next: NextFunction) => void;
/**
 * Scopes program_officer to their assigned center only.
 * Checks that the centerId in the request params/body matches
 * the officer's assigned center. super_admin bypasses this.
 */
export declare const scopeToCenter: (req: AuthRequest, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=role.middleware.d.ts.map