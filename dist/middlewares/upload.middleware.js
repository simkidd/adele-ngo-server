"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadBlogCover = exports.uploadPassportPhoto = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = require("../config/cloudinary");
const apiError_1 = require("../utils/apiError");
const createStorage = (folder) => new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.cloudinary,
    params: {
        folder: `adele-foundation/${folder}`,
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ width: 800, crop: "limit", quality: "auto" }],
    },
});
exports.uploadPassportPhoto = (0, multer_1.default)({
    storage: createStorage("passport-photos"),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            cb(new apiError_1.ApiError("Only image files are allowed.", 400), false);
            return;
        }
        cb(null, true);
    },
}).single("passportPhoto");
exports.uploadBlogCover = (0, multer_1.default)({
    storage: createStorage("blog-covers"),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            cb(new apiError_1.ApiError("Only image files are allowed.", 400), false);
            return;
        }
        cb(null, true);
    },
}).single("coverImage");
//# sourceMappingURL=upload.middleware.js.map