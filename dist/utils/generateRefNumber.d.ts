/**
 * Generates a reference number in the format:
 * AEF-{CENTER_CODE}-{YEAR}-{6-digit-sequence}
 * e.g. AEF-PH-2025-000042
 */
export declare const generateRefNumber: (centerCode: string) => Promise<string>;
/**
 * Generates a certificate ID in the format:
 * AEF-{CENTER_CODE}-{YEAR}-{PROGRAM_CODE}-{6-digit-sequence}
 * e.g. AEF-PH-2025-EL-000042
 */
export declare const generateCertId: (centerCode: string, programTitle: string) => Promise<string>;
//# sourceMappingURL=generateRefNumber.d.ts.map