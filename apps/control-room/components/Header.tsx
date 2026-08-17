import type { View } from "../types";

interface HeaderProps {
    username: string;
    current: View["name"];
    onNavigate: (view: View) => void;
    onLogout: () => void;
}

export function Header({ username, current, onNavigate, onLogout }: HeaderProps) {
    const navItem = (label: string, active: boolean, onClick: () => void) => (
        <button
            onClick={onClick}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-200"
            }`}
        >
            {label}
        </button>
    );

    return (
        <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">Control Room</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                        {username}
                    </span>
                </div>
                <nav className="flex items-center gap-1">
                    {navItem("Products", current === "list", () => onNavigate({ name: "list" }))}
                    {navItem("New Product", current === "create", () => onNavigate({ name: "create" }))}
                    <button
                        onClick={onLogout}
                        className="ml-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        Log out
                    </button>
                </nav>
            </div>
        </header>
    );
}
