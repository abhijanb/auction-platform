import React, { useState } from "react";
import type { AuthUser } from "../types";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import { AuthModeToggle } from "./components/AuthModeToggle";
import { Card } from "../components/Card";

export function AuthView({ onAuthed }: { onAuthed: (user: AuthUser) => void }) {
    const [mode, setMode] = useState<"login" | "register">("login");

    return (
        <Card className="w-full max-w-md">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Control Room</h1>
            <AuthModeToggle mode={mode} onChange={setMode} />
            {mode === "login" ? (
                <LoginForm onAuthed={onAuthed} />
            ) : (
                <RegisterForm onAuthed={onAuthed} />
            )}
        </Card>
    );
}