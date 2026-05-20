"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCertId = exports.generateRefNumber = void 0;
const certificate_model_1 = require("../models/certificate.model");
const registration_model_1 = require("../models/registration.model");
/**
 * Generates a reference number in the format:
 * AEF-{CENTER_CODE}-{YEAR}-{6-digit-sequence}
 * e.g. AEF-PH-2025-000042
 */
const generateRefNumber = async (centerCode) => {
    const year = new Date().getFullYear();
    const prefix = `AEF-${centerCode}-${year}-`;
    // Count existing registrations for this center this year
    const regex = new RegExp(`^${prefix}`);
    const count = await registration_model_1.Registration.countDocuments({
        referenceNumber: { $regex: regex },
    });
    const sequence = String(count + 1).padStart(6, "0");
    return `${prefix}${sequence}`;
};
exports.generateRefNumber = generateRefNumber;
/**
 * Generates a certificate ID in the format:
 * AEF-{CENTER_CODE}-{YEAR}-{PROGRAM_CODE}-{6-digit-sequence}
 * e.g. AEF-PH-2025-EL-000042
 */
const generateCertId = async (centerCode, programTitle) => {
    const year = new Date().getFullYear();
    // Generate a short code from program title (first 2-3 chars of significant words)
    const programCode = programTitle
        .split(/[\s&,]+/)
        .filter((w) => w.length > 2)
        .slice(0, 2)
        .map((w) => w.charAt(0).toUpperCase())
        .join("");
    const prefix = `AEF-${centerCode}-${year}-${programCode}-`;
    const regex = new RegExp(`^${prefix}`);
    const count = await certificate_model_1.Certificate.countDocuments({
        certId: { $regex: regex },
    });
    const sequence = String(count + 1).padStart(6, "0");
    return `${prefix}${sequence}`;
};
exports.generateCertId = generateCertId;
//# sourceMappingURL=generateRefNumber.js.map