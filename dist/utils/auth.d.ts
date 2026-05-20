/**
 * Hash a password using bcrypt
 */
export declare const hashPassword: (password: string) => Promise<string>;
/**
 * Compare a plain text password with a hashed password
 */
export declare const comparePassword: (password: string, hashedPassword: string) => Promise<boolean>;
//# sourceMappingURL=auth.d.ts.map