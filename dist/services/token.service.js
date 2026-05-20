"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.verifyRefreshToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const generateAccessToken = (id, type) => {
    const secret = type === "admin"
        ? config_1.config.jwt.ACCESS_SECRET
        : config_1.config.applicantJwt.ACCESS_SECRET;
    const expiresIn = config_1.config.jwt.ACCESS_EXPIRES;
    return jsonwebtoken_1.default.sign({ id, type }, secret, { expiresIn });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (id, type) => {
    const secret = type === "admin"
        ? config_1.config.jwt.REFRESH_SECRET
        : config_1.config.applicantJwt.REFRESH_SECRET;
    const expiresIn = config_1.config.jwt.REFRESH_EXPIRES;
    return jsonwebtoken_1.default.sign({ id, type }, secret, { expiresIn });
};
exports.generateRefreshToken = generateRefreshToken;
const verifyRefreshToken = (token, type) => {
    const secret = type === "admin"
        ? config_1.config.jwt.REFRESH_SECRET
        : config_1.config.applicantJwt.REFRESH_SECRET;
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.verifyRefreshToken = verifyRefreshToken;
const verifyToken = (token, type) => {
    try {
        const secret = type === "admin"
            ? config_1.config.jwt.ACCESS_SECRET
            : config_1.config.applicantJwt.ACCESS_SECRET;
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        return decoded;
    }
    catch (error) {
        throw new Error("Invalid token");
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=token.service.js.map