type TokenType = "admin" | "applicant";
export interface JwtPayload {
    id: string;
    role?: string;
    type: "admin" | "applicant";
}
export declare const generateAccessToken: (id: string, type: TokenType) => string;
export declare const generateRefreshToken: (id: string, type: TokenType) => string;
export declare const verifyRefreshToken: (token: string, type: TokenType) => {
    id: string;
    type: TokenType;
};
export declare const verifyToken: (token: string, type: TokenType) => JwtPayload;
export {};
//# sourceMappingURL=token.service.d.ts.map