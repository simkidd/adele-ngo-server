import mongoose from "mongoose";
import { IProgram } from "../interfaces/program.interface";
export declare const Program: mongoose.Model<IProgram, {}, {}, {}, mongoose.Document<unknown, {}, IProgram, {}, mongoose.DefaultSchemaOptions> & IProgram & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IProgram>;
//# sourceMappingURL=program.model.d.ts.map