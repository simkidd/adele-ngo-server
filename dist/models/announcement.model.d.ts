import mongoose from "mongoose";
import { IAnnouncement } from "../interfaces/annoucement.interface";
export declare const Announcement: mongoose.Model<IAnnouncement, {}, {}, {}, mongoose.Document<unknown, {}, IAnnouncement, {}, mongoose.DefaultSchemaOptions> & IAnnouncement & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IAnnouncement>;
//# sourceMappingURL=announcement.model.d.ts.map