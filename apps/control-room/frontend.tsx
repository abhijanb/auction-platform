import React from "react";
import { createRoot } from "react-dom/client";
import { AuthView } from "./auth/AuthView";

const root = createRoot(document.getElementById("root")!);

export default function ControlRoom() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <AuthView />
        </div>
    );
}

root.render(<ControlRoom />);