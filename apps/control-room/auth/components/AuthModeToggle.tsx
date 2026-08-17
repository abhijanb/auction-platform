interface AuthModeToggleProps {
    mode: "login" | "register";
    onChange: (mode: "login" | "register") => void;
}

export function AuthModeToggle({ mode, onChange }: AuthModeToggleProps) {
    const item = (label: string, value: "login" | "register") => (
        <button
            type="button"
            onClick={() => onChange(value)}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === value ? "bg-indigo-600 text-white" : "bg-white text-gray-600"}`}
        >
            {label}
        </button>
    );

    return (
        <div className="flex rounded-lg overflow-hidden border border-gray-300 mb-6">
            {item("Login", "login")}
            {item("Register", "register")}
        </div>
    );
}