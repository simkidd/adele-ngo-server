import mongoose from "mongoose";
import { IRegistration } from "../interfaces/registration.interface";
export declare const Registration: mongoose.Model<IRegistration, {}, {}, {}, mongoose.Document<unknown, {}, IRegistration, {}, mongoose.DefaultSchemaOptions> & IRegistration & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IRegistration>;
//# sourceMappingURL=registration.model.d.ts.map