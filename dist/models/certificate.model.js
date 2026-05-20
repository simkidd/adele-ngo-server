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
exports.Certificate = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const certificateSchema = new mongoose_1.Schema({
    certId: { type: String, required: true, unique: true, index: true },
    registrationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Registration",
        required: true,
        unique: true,
    },
    applicantId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Applicant",
        required: true,
    },
    graduateName: { type: String, required: true },
    programId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Program", required: true },
    programTitle: { type: String, required: true },
    centerId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Center", required: true },
    centerName: { type: String, required: true },
    cohortId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Cohort", required: true },
    cohortName: { type: String, required: true },
    trainingStart: { type: Date, required: true },
    trainingEnd: { type: Date, required: true },
    issueDate: { type: Date, required: true, default: Date.now },
    issuedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    pdfUrl: { type: String, required: true },
    pdfPublicId: { type: String, required: true },
    qrCodeUrl: { type: String, required: true },
    qrPublicId: { type: String, required: true },
}, { timestamps: true });
exports.Certificate = mongoose_1.default.model("Certificate", certificateSchema);
//# sourceMappingURL=certificate.model.js.map