import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
import { sendError } from "../utils/apiResponse";

export const validate = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    
    if (!result.success) {
      const firstError =
        result.error.issues?.[0]?.message ?? "Validation failed";

      sendError(res, firstError, 422);
      return;
    }
    req.body = result.data;
    next();
  };
};
