import { Certificate } from "../models/certificate.model";
import { Registration } from "../models/registration.model";
/**
 * Generates a reference number in the format:
 * AEF-{CENTER_CODE}-{YEAR}-{6-digit-sequence}
 * e.g. AEF-PH-2025-000042
 */
export const generateRefNumber = async (
  centerCode: string,
): Promise<string> => {
  const year = new Date().getFullYear();
  const prefix = `AEF-${centerCode}-${year}-`;

  // Count existing registrations for this center this year
  const regex = new RegExp(`^${prefix}`);
  const count = await Registration.countDocuments({
    referenceNumber: { $regex: regex },
  });

  const sequence = String(count + 1).padStart(6, "0");
  return `${prefix}${sequence}`;
};

/**
 * Generates a certificate ID in the format:
 * AEF-{CENTER_CODE}-{YEAR}-{PROGRAM_CODE}-{6-digit-sequence}
 * e.g. AEF-PH-2025-EL-000042
 */
export const generateCertId = async (
  centerCode: string,
  programTitle: string,
): Promise<string> => {
  const year = new Date().getFullYear();

  // Generate a short code from program title (first 2-3 chars of significant words)
  const programCode = programTitle
    .split(/[\s&,]+/)
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  const prefix = `AEF-${centerCode}-${year}-${programCode}-`;

  const regex = new RegExp(`^${prefix}`);
  const count = await Certificate.countDocuments({
    certId: { $regex: regex },
  });

  const sequence = String(count + 1).padStart(6, "0");
  return `${prefix}${sequence}`;
};
