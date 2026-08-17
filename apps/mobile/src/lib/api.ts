import axios, { AxiosError } from "axios";
import { z } from "zod";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export const client = axios.create({ baseURL: API_URL });

export interface RegisterInput {
    username: string;
    password: string;
}

export class ApiError extends Error {
    constructor(message: string, readonly status: number) {
        super(message);
    }
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
export type loginSchemaType = z.infer<typeof loginSchema>
export interface LoginResponse {
    token: string;
    user: {
        id: string;
        username: string;
        role: string;
    };
}

export async function register(body: RegisterInput): Promise<{ success: boolean; message: string }> {
    try {
        registerSchema.parse(body);
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(error.issues[0]?.message ?? "Invalid input");
        }
        throw error;
    }
    return request("/register", { method: "POST", data: body });
}

export async function login(body: RegisterInput): Promise<LoginResponse> {
    try {
        loginSchema.parse(body);
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(error.issues[0]?.message ?? "Invalid input");
        }
        throw error;
    }
    return request("/login", { method: "POST", data: body });
}

async function request<T>(path: string, opts: { method?: string; data?: unknown } = {}): Promise<T> {
    const { method, data } = opts;
    try {
        const response = await client.request<T>({
            url: path,
            method: method ?? (data !== undefined ? "POST" : "GET"),
            data,
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            const message = (error.response?.data as { error?: string } | undefined)?.error ?? error.message;
            throw new ApiError(message, error.response?.status ?? 0);
        }
        throw error;
    }
}