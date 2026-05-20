"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = void 0;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const _1 = require(".");
cloudinary_1.v2.config({
    cloud_name: _1.config.cloudinary.CLOUD_NAME,
    api_key: _1.config.cloudinary.API_KEY,
    api_secret: _1.config.cloudinary.API_SECRET,
    secure: true,
});
//# sourceMappingURL=cloudinary.js.map