import { Request, Response, NextFunction } from "express";
import { AdminRole } from "../interfaces/user.interface";
export declare const restrictTo: (...roles: AdminRole[]) => (req: Request, _res: Response, next: NextFunction) => void;
/**
 * Scopes program_officer to their assigned center only.
 * Checks that the centerId in the request params/body matches
 * the officer's assigned center. super_admin bypasses this.
 */
export declare const scopeToCenter: (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=role.middleware.d.ts.map