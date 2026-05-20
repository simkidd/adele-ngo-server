import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
// import "express-async-errors";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config";
import routes from "./routes";
import {
  authLimiter,
  globalLimiter,
  ninLimiter,
} from "./middlewares/rate-limiter.middleware";
import { sendError } from "./utils/apiResponse";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(mongoSanitize());

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: [config.app.CLIENT_URL, config.app.ADMIN_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ── Rate limiting ─────────────────────────────────────────────────────────────
app.use(globalLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/applicant/login", authLimiter);
app.use("/api/applicant/nin", ninLimiter);

// ── Body & Cookies ────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(compression());

// ── Logging ───────────────────────────────────────────────────────────────────
if (config.app.NODE_ENV !== "test") {
  app.use(morgan(config.app.NODE_ENV === "production" ? "combined" : "dev"));
}

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Adele Foundation API is running",
    env: config.app.NODE_ENV,
    time: new Date().toISOString(),
  });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api", routes);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  sendError(res, `Cannot ${req.method} ${req.originalUrl}`, 404);
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorHandler);

export default app;
