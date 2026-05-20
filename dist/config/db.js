"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const _1 = require(".");
const logger_1 = require("../utils/logger");
const connectDB = async () => {
    try {
        mongoose_1.default.set("strictQuery", true);
        const conn = await mongoose_1.default.connect(_1.config.db.MONGODB_URI, {
            dbName: "adele-foundation",
        });
        logger_1.logger.info(`MongoDB connected: ${conn.connection.host}`);
        mongoose_1.default.connection.on("error", (err) => {
            logger_1.logger.error(`MongoDB connection error: ${err.message}`);
        });
        mongoose_1.default.connection.on("disconnected", () => {
            logger_1.logger.warn("MongoDB disconnected. Attempting reconnect...");
        });
    }
    catch (error) {
        logger_1.logger.error(`MongoDB connection failed: ${error.message}`);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.js.map