"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const config_1 = require("../config");
const encrypt = (value) => {
    return crypto_js_1.default.AES.encrypt(value, config_1.config.security.ENCRYPTION_KEY).toString();
};
exports.encrypt = encrypt;
const decrypt = (encryptedValue) => {
    const bytes = crypto_js_1.default.AES.decrypt(encryptedValue, config_1.config.security.ENCRYPTION_KEY);
    return bytes.toString(crypto_js_1.default.enc.Utf8);
};
exports.decrypt = decrypt;
//# sourceMappingURL=encryption.js.map