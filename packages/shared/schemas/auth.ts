import { z } from "zod";

export const registerSchema = z.object({
    username: z.string().min(3).max(50),
    password: z.string().min(8).max(128),
});

export const loginSchema = registerSchema.pick({
    username: true,
    password: true,
});

export type RegisterBody = z.infer<typeof registerSchema>;
export type LoginBody = z.infer<typeof loginSchema>;