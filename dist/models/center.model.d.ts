import mongoose from "mongoose";
import { ICenter } from "../interfaces/center.interface";
export declare const Center: mongoose.Model<ICenter, {}, {}, {}, mongoose.Document<unknown, {}, ICenter, {}, mongoose.DefaultSchemaOptions> & ICenter & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ICenter>;
//# sourceMappingURL=center.model.d.ts.map