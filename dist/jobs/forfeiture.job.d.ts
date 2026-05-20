/**
 * Runs every night at 02:00 AM.
 * Finds all Accepted registrations where verificationDeadline has passed.
 * Deletes them silently — no email sent, applicant account preserved.
 * Restores the slot count in the cohort.
 */
export declare const startForfeitureJob: () => void;
//# sourceMappingURL=forfeiture.job.d.ts.map