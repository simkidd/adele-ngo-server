"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQrDataUrl = exports.generateQrBuffer = void 0;
const qrcode_1 = __importDefault(require("qrcode"));
const config_1 = require("../config");
const generateQrBuffer = async (certId) => {
    const url = `${config_1.config.foundation.WEBSITE}/verify/${certId}`;
    const buffer = await qrcode_1.default.toBuffer(url, {
        type: "png",
        width: 300,
        margin: 2,
        color: { dark: "#0f172a", light: "#ffffff" },
        errorCorrectionLevel: "H",
    });
    return buffer;
};
exports.generateQrBuffer = generateQrBuffer;
const generateQrDataUrl = async (certId) => {
    const url = `${config_1.config.foundation.WEBSITE}/verify/${certId}`;
    return qrcode_1.default.toDataURL(url, {
        width: 200,
        margin: 1,
        color: { dark: "#0f172a", light: "#ffffff" },
        errorCorrectionLevel: "H",
    });
};
exports.generateQrDataUrl = generateQrDataUrl;
//# sourceMappingURL=qr.service.js.map