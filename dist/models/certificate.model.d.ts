import mongoose from "mongoose";
import { ICertificate } from "../interfaces/certificate.interface";
export declare const Certificate: mongoose.Model<ICertificate, {}, {}, {}, mongoose.Document<unknown, {}, ICertificate, {}, mongoose.DefaultSchemaOptions> & ICertificate & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ICertificate>;
//# sourceMappingURL=certificate.model.d.ts.map