import jwt from "jsonwebtoken";
import { config } from "../config";

type TokenType = "admin" | "applicant";

export interface JwtPayload {
  id: string;
  role?: string;
  type: "admin" | "applicant";
}

export const generateAccessToken = (id: string, type: TokenType): string => {
  const secret =
    type === "admin"
      ? config.jwt.ACCESS_SECRET
      : config.applicantJwt.ACCESS_SECRET;
  const expiresIn = config.jwt.ACCESS_EXPIRES;
  return jwt.sign({ id, type }, secret, { expiresIn } as jwt.SignOptions);
};

export const generateRefreshToken = (id: string, type: TokenType): string => {
  const secret =
    type === "admin"
      ? config.jwt.REFRESH_SECRET
      : config.applicantJwt.REFRESH_SECRET;
  const expiresIn = config.jwt.REFRESH_EXPIRES;
  return jwt.sign({ id, type }, secret, { expiresIn } as jwt.SignOptions);
};

export const verifyRefreshToken = (
  token: string,
  type: TokenType,
): { id: string; type: TokenType } => {
  const secret =
    type === "admin"
      ? config.jwt.REFRESH_SECRET
      : config.applicantJwt.REFRESH_SECRET;
  return jwt.verify(token, secret) as { id: string; type: TokenType };
};

export const verifyToken = (token: string, type: TokenType): JwtPayload => {
  try {
    const secret =
      type === "admin"
        ? config.jwt.ACCESS_SECRET
        : config.applicantJwt.ACCESS_SECRET;
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};
