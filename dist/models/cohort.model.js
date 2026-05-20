"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cohort = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const cohortProgramSchema = new mongoose_1.Schema({
    programId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Program", required: true },
    totalSeats: { type: Number, required: true, min: 1 },
    enrolledCount: { type: Number, default: 0, min: 0 },
}, { _id: false });
const centerCohortSchema = new mongoose_1.Schema({
    centerId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Center", required: true },
    programs: [cohortProgramSchema],
}, { _id: false });
const cohortSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    applicationStart: { type: Date, required: true },
    applicationEnd: { type: Date, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
        type: String,
        enum: ["Draft", "Open", "Closed", "Active", "Completed"],
        default: "Draft",
    },
    centers: [centerCohortSchema],
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    publishedAt: { type: Date },
    completedAt: { type: Date },
}, { timestamps: true });
// Only one cohort can be Open or Active at a time — enforced at service level
cohortSchema.index({ status: 1 });
exports.Cohort = mongoose_1.default.model("Cohort", cohortSchema);
//# sourceMappingURL=cohort.model.js.map