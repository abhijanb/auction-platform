import React, { useEffect, useState } from "react";
import { loginSchema, registerSchema } from "../../../packages/shared/schemas/auth";
import { apiFetch, clearToken, storeToken } from "../api/client";

interface AuthUser {
    id: string;
    username: string;
    role: "USER" | "ADMIN";
}

export function AuthView() {
    const [mode, setMode] = useState<"login" | "register">("login");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<AuthUser | null>(null);

    async function checkSession(): Promise<void> {
        try {
            const data = await apiFetch<{ user: AuthUser }>("/me");
            setUser(data.user);
        } catch {
            setUser(null);
        }
    }

    useEffect(() => {
        checkSession();
    }, []);

    async function handleSubmit(event: React.FormEvent): Promise<void> {
        event.preventDefault();
        setError(null);
        const schema = mode === "login" ? loginSchema : registerSchema;

        const parsed = schema.safeParse({ username, password });
        if (!parsed.success) {
            const first = parsed.error.issues[0];
            setError(first ? `${first.path.join(".")}: ${first.message}` : "Invalid input");
            return;
        }

        try {
            if (mode === "register") {
                await apiFetch<{ success: boolean; message: string }>("/register", parsed.data);
            }
            const data = await apiFetch<{ token: string; user: AuthUser }>("/login", parsed.data);
            storeToken(data.token);
            setUser(data.user);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        }
    }

    async function handleLogout(): Promise<void> {
        clearToken();
        setUser(null);
        setPassword("");
    }

    if (user) {
        return (
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Control Room</h1>
                <p className="text-gray-600 mb-2">Logged in as <span className="font-semibold">{user.username}</span></p>
                <span className="inline-block px-2 py-1 rounded-full text-xs font-medium mb-6 bg-indigo-100 text-indigo-700">
                    {user.role}
                </span>
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                    Log out
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Control Room</h1>
            <div className="flex rounded-lg overflow-hidden border border-gray-300 mb-6">
                <button
                    type="button"
                    onClick={() => { setMode("login"); setError(null); }}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === "login" ? "bg-indigo-600 text-white" : "bg-white text-gray-600"}`}
                >
                    Login
                </button>
                <button
                    type="button"
                    onClick={() => { setMode("register"); setError(null); }}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === "register" ? "bg-indigo-600 text-white" : "bg-white text-gray-600"}`}
                >
                    Register
                </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        minLength={3}
                        maxLength={50}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={8}
                        maxLength={128}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                {error && (
                    <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
                )}
                <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                    {mode === "login" ? "Log in" : "Create account"}
                </button>
            </form>
        </div>
    );
}