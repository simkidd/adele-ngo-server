import { Request, Response } from "express";
export declare const registerApplicant: (req: Request, res: Response) => Promise<void>;
export declare const loginApplicant: (req: Request, res: Response) => Promise<void>;
export declare const refreshApplicantToken: (req: Request, res: Response) => Promise<void>;
export declare const logoutApplicant: (req: Request, res: Response) => Promise<void>;
export declare const getApplicantMe: (req: Request, res: Response) => Promise<void>;
export declare const updateApplicantProfile: (req: Request, res: Response) => Promise<void>;
export declare const changeApplicantPassword: (req: Request, res: Response) => Promise<void>;
export declare const getApplicantApplications: (req: Request, res: Response) => Promise<void>;
export declare const getApplicantApplication: (req: Request, res: Response) => Promise<void>;
export declare const getApplicantCertificate: (req: Request, res: Response) => Promise<void>;
export declare const getApplicantAnnouncements: (req: Request, res: Response) => Promise<void>;
export declare const getApplicantDashboard: (req: Request, res: Response) => Promise<void>;
export declare const createReturningApplication: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=applicant.controller.d.ts.map