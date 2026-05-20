import app from "./app";
import { config } from "./config";
import { connectDB } from "./config/db";
import { logger } from "./utils/logger";
// import { startForfeitureJob } from "./jobs/forfeiture.job";

const start = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start background jobs
    // startForfeitureJob();

    // Start server
    const PORT = Number(config.app.PORT) || 5000;
    app.listen(PORT, () => {
      logger.info(`
╔════════════════════════════════════════════╗
║   Adele Empowerment Foundation API         ║
║   Running on port ${PORT}                     ║
║   Environment: ${config.app.NODE_ENV}                 ║
╚════════════════════════════════════════════╝
      `);
    });
  } catch (err) {
    logger.error(`Server failed to start: ${(err as Error).message}`);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  logger.info("SIGINT received. Shutting down...");
  process.exit(0);
});

process.on("unhandledRejection", (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);
  process.exit(1);
});

start();
