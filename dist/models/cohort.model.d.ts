import mongoose from "mongoose";
import { ICohort } from "../interfaces/cohort.interface";
export declare const Cohort: mongoose.Model<ICohort, {}, {}, {}, mongoose.Document<unknown, {}, ICohort, {}, mongoose.DefaultSchemaOptions> & ICohort & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ICohort>;
//# sourceMappingURL=cohort.model.d.ts.map