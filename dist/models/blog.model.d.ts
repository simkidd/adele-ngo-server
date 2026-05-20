import mongoose from "mongoose";
import { IBlogPost } from "../interfaces/blog.interface";
export declare const BlogPost: mongoose.Model<IBlogPost, {}, {}, {}, mongoose.Document<unknown, {}, IBlogPost, {}, mongoose.DefaultSchemaOptions> & IBlogPost & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IBlogPost>;
//# sourceMappingURL=blog.model.d.ts.map