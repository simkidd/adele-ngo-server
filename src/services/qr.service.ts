import QRCode from "qrcode";
import { config } from "../config";

export const generateQrBuffer = async (certId: string): Promise<Buffer> => {
  const url = `${config.foundation.WEBSITE}/verify/${certId}`;

  const buffer = await QRCode.toBuffer(url, {
    type: "png",
    width: 300,
    margin: 2,
    color: { dark: "#0f172a", light: "#ffffff" },
    errorCorrectionLevel: "H",
  });

  return buffer;
};

export const generateQrDataUrl = async (certId: string): Promise<string> => {
  const url = `${config.foundation.WEBSITE}/verify/${certId}`;
  return QRCode.toDataURL(url, {
    width: 200,
    margin: 1,
    color: { dark: "#0f172a", light: "#ffffff" },
    errorCorrectionLevel: "H",
  });
};
