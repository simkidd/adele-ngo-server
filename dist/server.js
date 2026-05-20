"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const db_1 = require("./config/db");
const logger_1 = require("./utils/logger");
// import { startForfeitureJob } from "./jobs/forfeiture.job";
const start = async () => {
    try {
        // Connect to MongoDB
        await (0, db_1.connectDB)();
        // Start background jobs
        // startForfeitureJob();
        // Start server
        const PORT = Number(config_1.config.app.PORT) || 5000;
        app_1.default.listen(PORT, () => {
            logger_1.logger.info(`
╔════════════════════════════════════════════╗
║   Adele Empowerment Foundation API         ║
║   Running on port ${PORT}                     ║
║   Environment: ${config_1.config.app.NODE_ENV}                 ║
╚════════════════════════════════════════════╝
      `);
        });
    }
    catch (err) {
        logger_1.logger.error(`Server failed to start: ${err.message}`);
        process.exit(1);
    }
};
// Graceful shutdown
process.on("SIGTERM", () => {
    logger_1.logger.info("SIGTERM received. Shutting down gracefully...");
    process.exit(0);
});
process.on("SIGINT", () => {
    logger_1.logger.info("SIGINT received. Shutting down...");
    process.exit(0);
});
process.on("unhandledRejection", (reason) => {
    logger_1.logger.error(`Unhandled Rejection: ${reason}`);
    process.exit(1);
});
start();
//# sourceMappingURL=server.js.map