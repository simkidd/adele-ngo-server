import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../config/cloudinary";
import { ApiError } from "../utils/apiError";

const createStorage = (folder: string) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `adele-foundation/${folder}`,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [{ width: 800, crop: "limit", quality: "auto" }],
    } as Record<string, unknown>,
  });

export const uploadPassportPhoto = multer({
  storage: createStorage("passport-photos"),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(
        new ApiError("Only image files are allowed.", 400) as unknown as null,
        false,
      );
      return;
    }
    cb(null, true);
  },
}).single("passportPhoto");

export const uploadBlogCover = multer({
  storage: createStorage("blog-covers"),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(
        new ApiError("Only image files are allowed.", 400) as unknown as null,
        false,
      );
      return;
    }
    cb(null, true);
  },
}).single("coverImage");
