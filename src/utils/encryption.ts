import CryptoJS from "crypto-js";
import { config } from "../config";

export const encrypt = (value: string): string => {
  return CryptoJS.AES.encrypt(value, config.security.ENCRYPTION_KEY).toString();
};

export const decrypt = (encryptedValue: string): string => {
  const bytes = CryptoJS.AES.decrypt(
    encryptedValue,
    config.security.ENCRYPTION_KEY,
  );

  return bytes.toString(CryptoJS.enc.Utf8);
};
