"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submissionSchema = void 0;
const zod_1 = require("zod");
exports.submissionSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name is required"),
    email: zod_1.z.email("Invalid email address"),
    phone: zod_1.z.string().optional(),
    enquiryType: zod_1.z.enum(["application", "volunteer", "general"]),
    program: zod_1.z.string().optional(),
    message: zod_1.z
        .string()
        .min(10, "Message must be at least 10 characters")
        .max(2000),
});
//# sourceMappingURL=submission.schema.js.map