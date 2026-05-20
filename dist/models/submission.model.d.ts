import mongoose from "mongoose";
import { ISubmission } from "../interfaces/submission.interface";
export declare const Submission: mongoose.Model<ISubmission, {}, {}, {}, mongoose.Document<unknown, {}, ISubmission, {}, mongoose.DefaultSchemaOptions> & ISubmission & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ISubmission>;
//# sourceMappingURL=submission.model.d.ts.map