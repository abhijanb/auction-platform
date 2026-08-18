import { z } from "zod";

export interface RegisterInput {
    username: string;
    password: string;
}

export const registerSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be between 3 and 50 characters")
        .max(50, "Username must be between 3 and 50 characters"),
    password: z
        .string()
        .min(8, "Password must be between 8 and 128 characters")
        .max(128, "Password must be between 8 and 128 characters"),
});

export const loginSchema = registerSchema;
export type loginSchemaType = z.infer<typeof loginSchema>;
