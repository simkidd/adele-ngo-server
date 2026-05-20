"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    app: {
        PORT: process.env.PORT || 5000,
        NODE_ENV: process.env.NODE_ENV || "development",
        CLIENT_URL: process.env.CLIENT_URL,
        ADMIN_URL: process.env.ADMIN_URL,
    },
    db: {
        MONGODB_URI: process.env.MONGODB_URI,
    },
    jwt: {
        ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
        REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
        ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES || "15m",
        REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES || "7d",
    },
    applicantJwt: {
        ACCESS_SECRET: process.env.APPLICANT_ACCESS_SECRET,
        REFRESH_SECRET: process.env.APPLICANT_REFRESH_SECRET,
    },
    cloudinary: {
        CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
        API_KEY: process.env.CLOUDINARY_API_KEY,
        API_SECRET: process.env.CLOUDINARY_API_SECRET,
    },
    brevo: {
        API_KEY: process.env.BREVO_API_KEY || "",
        FROM: process.env.MAIL_FROM,
        FROM_NAME: process.env.MAIL_FROM_NAME,
    },
    security: {
        ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    },
    foundation: {
        NAME: process.env.FOUNDATION_NAME || "Adele Empowerment Foundation",
        WEBSITE: process.env.FOUNDATION_WEBSITE,
    },
};
//# sourceMappingURL=index.js.map