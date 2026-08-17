import axios, { AxiosError } from "axios";

const TOKEN_KEY = "control_room_token";

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function storeToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
}

export const client = axios.create({ baseURL: "" });

client.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export async function apiFetch<T>(path: string, data?: unknown): Promise<T> {
    try {
        const response = await client.request<T>({
            url: path,
            method: data !== undefined ? "POST" : "GET",
            data,
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.error ?? error.message);
        }
        throw error;
    }
}