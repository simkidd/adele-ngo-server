import { v2 as cloudinary } from "cloudinary";
import { config } from ".";

cloudinary.config({
  cloud_name: config.cloudinary.CLOUD_NAME,
  api_key: config.cloudinary.API_KEY,
  api_secret: config.cloudinary.API_SECRET,
  secure: true,
});

export { cloudinary };
