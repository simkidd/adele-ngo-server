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
exports.Registration = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const registrationSchema = new mongoose_1.Schema({
    applicantId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Applicant",
        required: true,
    },
    cohortId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Cohort", required: true },
    centerId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Center", required: true },
    programId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Program", required: true },
    secondChoiceId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Program" },
    qualification: { type: String, required: true },
    employmentStatus: { type: String, required: true },
    priorExperience: { type: String, required: true },
    experienceDetail: { type: String },
    motivation: { type: String, required: true, minlength: 20 },
    postTrainingPlan: { type: String, required: true },
    referralSource: { type: String, required: true },
    specialNeeds: { type: String },
    emergencyName: { type: String, required: true },
    emergencyPhone: { type: String, required: true },
    emergencyRelation: { type: String, required: true },
    referenceNumber: { type: String, required: true, unique: true },
    status: {
        type: String,
        enum: [
            "Pending",
            "Accepted",
            "Verified",
            "Enrolled",
            "Completed",
            "Rejected",
        ],
        default: "Pending",
    },
    verificationDeadline: { type: Date },
    reviewedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    adminNotes: { type: String },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Compound index: one application per applicant per cohort
registrationSchema.index({ applicantId: 1, cohortId: 1 }, { unique: true });
registrationSchema.index({ centerId: 1, status: 1 });
registrationSchema.index({ programId: 1, cohortId: 1 });
// Virtuals
registrationSchema.virtual("applicant", {
    ref: "Applicant",
    localField: "applicantId",
    foreignField: "_id",
    justOne: true,
});
registrationSchema.virtual("appliedAt").get(function () {
    return this.createdAt;
});
exports.Registration = mongoose_1.default.model("Registration", registrationSchema);
//# sourceMappingURL=registration.model.js.map