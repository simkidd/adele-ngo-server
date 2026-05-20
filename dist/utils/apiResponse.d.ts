import { Response } from "express";
interface ApiResponseOptions {
    success: boolean;
    message: string;
    data?: unknown;
    meta?: Record<string, unknown>;
}
export declare const sendResponse: (res: Response, statusCode: number, options: ApiResponseOptions) => Response;
export declare const sendSuccess: (res: Response, data: unknown, message?: string, statusCode?: number, meta?: Record<string, unknown>) => Response;
export declare const sendError: (res: Response, message: string, statusCode?: number) => Response;
export {};
//# sourceMappingURL=apiResponse.d.ts.map