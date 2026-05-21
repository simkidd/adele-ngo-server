import { IApplicant } from "../interfaces/applicant.interface";
import { IUser } from "../interfaces/user.interface";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      applicant?: IApplicant;
    }
  }
}

export {};
