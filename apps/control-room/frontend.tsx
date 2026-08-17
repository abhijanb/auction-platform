import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { AuthView } from "./auth/AuthView";
import { apiFetch, clearToken } from "./api/client";
import type { AuthUser, View } from "./types";
import { Header } from "./components/Header";
import { AccessDenied } from "./components/AccessDenied";
import { ProductsView } from "./products/ProductsView";
import { CreateProductView } from "./products/CreateProductView";
import { EditProductView } from "./products/EditProductView";

const root = createRoot(document.getElementById("root")!);

function Dashboard({ user, view, onNavigate, onLogout }: {
    user: AuthUser;
    view: View;
    onNavigate: (view: View) => void;
    onLogout: () => void;
}) {
    if (user.role !== "ADMIN") {
        return <AccessDenied onLogout={onLogout} />;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Header username={user.username} current={view.name} onNavigate={onNavigate} onLogout={onLogout} />
            <main className="max-w-5xl mx-auto px-4 py-6">
                {view.name === "list" && <ProductsView onEdit={(id) => onNavigate({ name: "edit", id })} />}
                {view.name === "create" && <CreateProductView onDone={() => onNavigate({ name: "list" })} />}
                {view.name === "edit" && <EditProductView id={view.id} onDone={() => onNavigate({ name: "list" })} />}
            </main>
        </div>
    );
}

function ControlRoom() {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [view, setView] = useState<View>({ name: "list" });

    useEffect(() => {
        apiFetch<{ user: AuthUser }>("/me")
            .then((data) => setUser(data.user))
            .catch(() => setUser(null));
    }, []);

    function handleLogout(): void {
        clearToken();
        setUser(null);
        setView({ name: "list" });
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <AuthView onAuthed={setUser} />
            </div>
        );
    }

    return (
        <Dashboard
            user={user}
            view={view}
            onNavigate={setView}
            onLogout={handleLogout}
        />
    );
}

root.render(<ControlRoom />);