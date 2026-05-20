import mongoose from "mongoose";
import { IApplicant } from "../interfaces/applicant.interface";
export declare const Applicant: mongoose.Model<IApplicant, {}, {}, {}, mongoose.Document<unknown, {}, IApplicant, {}, mongoose.DefaultSchemaOptions> & IApplicant & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IApplicant>;
//# sourceMappingURL=applicant.model.d.ts.map