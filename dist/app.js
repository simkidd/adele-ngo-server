"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
// import "express-async-errors";
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = require("./config");
const routes_1 = __importDefault(require("./routes"));
const rate_limiter_middleware_1 = require("./middlewares/rate-limiter.middleware");
const apiResponse_1 = require("./utils/apiResponse");
const error_middleware_1 = require("./middlewares/error.middleware");
const app = (0, express_1.default)();
// ── Security ──────────────────────────────────────────────────────────────────
app.use((0, helmet_1.default)());
app.use((0, express_mongo_sanitize_1.default)());
// ── CORS ──────────────────────────────────────────────────────────────────────
app.use((0, cors_1.default)({
    origin: [config_1.config.app.CLIENT_URL, config_1.config.app.ADMIN_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// ── Rate limiting ─────────────────────────────────────────────────────────────
app.use(rate_limiter_middleware_1.globalLimiter);
app.use("/api/auth/login", rate_limiter_middleware_1.authLimiter);
app.use("/api/applicant/login", rate_limiter_middleware_1.authLimiter);
app.use("/api/applicant/nin", rate_limiter_middleware_1.ninLimiter);
// ── Body & Cookies ────────────────────────────────────────────────────────────
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
app.use((0, cookie_parser_1.default)());
app.use((0, compression_1.default)());
// ── Logging ───────────────────────────────────────────────────────────────────
if (config_1.config.app.NODE_ENV !== "test") {
    app.use((0, morgan_1.default)(config_1.config.app.NODE_ENV === "production" ? "combined" : "dev"));
}
// ── Health check ──────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
    res.json({
        success: true,
        message: "Adele Foundation API is running",
        env: config_1.config.app.NODE_ENV,
        time: new Date().toISOString(),
    });
});
// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api", routes_1.default);
// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
    (0, apiResponse_1.sendError)(res, `Cannot ${req.method} ${req.originalUrl}`, 404);
});
// ── Global error handler ──────────────────────────────────────────────────────
app.use(error_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map