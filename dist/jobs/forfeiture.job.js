"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startForfeitureJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const registration_model_1 = require("../models/registration.model");
const cohort_model_1 = require("../models/cohort.model");
const logger_1 = require("../utils/logger");
/**
 * Runs every night at 02:00 AM.
 * Finds all Accepted registrations where verificationDeadline has passed.
 * Deletes them silently — no email sent, applicant account preserved.
 * Restores the slot count in the cohort.
 */
const startForfeitureJob = () => {
    node_cron_1.default.schedule("0 2 * * *", async () => {
        logger_1.logger.info("[Forfeiture Job] Running...");
        try {
            const now = new Date();
            // Find all expired accepted registrations
            const expired = await registration_model_1.Registration.find({
                status: "Accepted",
                verificationDeadline: { $lt: now },
            });
            if (expired.length === 0) {
                logger_1.logger.info("[Forfeiture Job] No expired registrations found.");
                return;
            }
            logger_1.logger.info(`[Forfeiture Job] Found ${expired.length} expired registration(s).`);
            for (const reg of expired) {
                try {
                    // Restore the seat in the cohort
                    await cohort_model_1.Cohort.updateOne({
                        _id: reg.cohortId,
                        "centers.centerId": reg.centerId,
                        "centers.programs.programId": reg.programId,
                    }, { $inc: { "centers.$[c].programs.$[p].enrolledCount": -1 } }, {
                        arrayFilters: [
                            { "c.centerId": reg.centerId },
                            { "p.programId": reg.programId },
                        ],
                    });
                    // Delete the registration — account (Applicant) is NOT deleted
                    await registration_model_1.Registration.findByIdAndDelete(reg._id);
                    logger_1.logger.info(`[Forfeiture Job] Deleted registration ${reg.referenceNumber} (deadline: ${reg.verificationDeadline?.toISOString()})`);
                }
                catch (innerErr) {
                    logger_1.logger.error(`[Forfeiture Job] Failed to process ${reg.referenceNumber}: ${innerErr.message}`);
                }
            }
            logger_1.logger.info(`[Forfeiture Job] Complete. Processed ${expired.length} forfeiture(s).`);
        }
        catch (err) {
            logger_1.logger.error(`[Forfeiture Job] Fatal error: ${err.message}`);
        }
    });
    logger_1.logger.info("[Forfeiture Job] Scheduled — runs daily at 02:00 AM");
};
exports.startForfeitureJob = startForfeitureJob;
//# sourceMappingURL=forfeiture.job.js.map