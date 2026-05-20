import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";
interface MongoError extends Error {
    code?: number;
    keyValue?: Record<string, unknown>;
    path?: string;
    value?: string;
}
export declare const errorHandler: (err: ApiError & MongoError, _req: Request, res: Response, _next: NextFunction) => void;
export {};
//# sourceMappingURL=error.middleware.d.ts.map