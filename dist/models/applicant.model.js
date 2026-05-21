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
exports.Applicant = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const applicantSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: { type: String, required: true, minlength: 8, select: false },
    refreshToken: { type: String, select: false },
    fullName: { type: String, required: true, trim: true },
    dob: { type: Date, required: true },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Prefer not to say"],
    },
    phone: { type: String, required: true, trim: true },
    whatsapp: { type: String, trim: true },
    stateOfOrigin: { type: String, required: true },
    lga: { type: String, required: true },
    address: { type: String, required: true },
    passportPhoto: { type: String },
    nin: { type: String, required: true, select: false },
    biometricEnrolled: { type: Boolean, default: false },
    biometricTemplate: { type: String, select: false },
    biometricEnrolledAt: { type: Date },
    biometricCenterId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Center" },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
}, { timestamps: true });
exports.Applicant = mongoose_1.default.model("Applicant", applicantSchema);
//# sourceMappingURL=applicant.model.js.map