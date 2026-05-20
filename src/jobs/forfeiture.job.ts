import cron from "node-cron";
import { Registration } from "../models/registration.model";
import { Cohort } from "../models/cohort.model";
import { logger } from "../utils/logger";

/**
 * Runs every night at 02:00 AM.
 * Finds all Accepted registrations where verificationDeadline has passed.
 * Deletes them silently — no email sent, applicant account preserved.
 * Restores the slot count in the cohort.
 */
export const startForfeitureJob = (): void => {
  cron.schedule("0 2 * * *", async () => {
    logger.info("[Forfeiture Job] Running...");

    try {
      const now = new Date();

      // Find all expired accepted registrations
      const expired = await Registration.find({
        status: "Accepted",
        verificationDeadline: { $lt: now },
      });

      if (expired.length === 0) {
        logger.info("[Forfeiture Job] No expired registrations found.");
        return;
      }

      logger.info(
        `[Forfeiture Job] Found ${expired.length} expired registration(s).`,
      );

      for (const reg of expired) {
        try {
          // Restore the seat in the cohort
          await Cohort.updateOne(
            {
              _id: reg.cohortId,
              "centers.centerId": reg.centerId,
              "centers.programs.programId": reg.programId,
            },
            { $inc: { "centers.$[c].programs.$[p].enrolledCount": -1 } },
            {
              arrayFilters: [
                { "c.centerId": reg.centerId },
                { "p.programId": reg.programId },
              ],
            },
          );

          // Delete the registration — account (Applicant) is NOT deleted
          await Registration.findByIdAndDelete(reg._id);

          logger.info(
            `[Forfeiture Job] Deleted registration ${reg.referenceNumber} (deadline: ${reg.verificationDeadline?.toISOString()})`,
          );
        } catch (innerErr) {
          logger.error(
            `[Forfeiture Job] Failed to process ${reg.referenceNumber}: ${(innerErr as Error).message}`,
          );
        }
      }

      logger.info(
        `[Forfeiture Job] Complete. Processed ${expired.length} forfeiture(s).`,
      );
    } catch (err) {
      logger.error(`[Forfeiture Job] Fatal error: ${(err as Error).message}`);
    }
  });

  logger.info("[Forfeiture Job] Scheduled — runs daily at 02:00 AM");
};
