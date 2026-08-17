import React, { useState } from "react";
import { registerSchema } from "../../../../packages/shared/schemas/auth";
import { apiFetch, storeToken } from "../../api/client";
import type { AuthUser } from "../../types";
import { ErrorBanner } from "../../components/ErrorBanner";

export function RegisterForm({ onAuthed }: { onAuthed: (user: AuthUser) => void }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent): Promise<void> {
        event.preventDefault();
        setError(null);

        const parsed = registerSchema.safeParse({ username, password });
        if (!parsed.success) {
            const first = parsed.error.issues[0];
            setError(first ? `${first.path.join(".")}: ${first.message}` : "Invalid input");
            return;
        }

        try {
            await apiFetch<{ success: boolean; message: string }>("/register", { data: parsed.data });
            const data = await apiFetch<{ token: string; user: AuthUser }>("/login", { data: parsed.data });
            storeToken(data.token);
            onAuthed(data.user);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        }
    }

    const inputClass =
        "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500";

    return (
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
                    className={inputClass}
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
                    className={inputClass}
                />
            </div>
            {error && <ErrorBanner message={error} />}
            <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
                Create account
            </button>
        </form>
    );
}