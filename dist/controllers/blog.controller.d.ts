import { Request, Response } from "express";
export declare const createPost: (req: Request, res: Response) => Promise<void>;
export declare const listPosts: (req: Request, res: Response) => Promise<void>;
export declare const getPublishedPosts: (req: Request, res: Response) => Promise<void>;
export declare const getPostBySlug: (req: Request, res: Response) => Promise<void>;
export declare const getPostById: (req: Request, res: Response) => Promise<void>;
export declare const updatePost: (req: Request, res: Response) => Promise<void>;
export declare const deletePost: (req: Request, res: Response) => Promise<void>;
export declare const uploadCoverImage: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=blog.controller.d.ts.map