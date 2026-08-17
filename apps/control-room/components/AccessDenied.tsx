import { Card } from "./Card";

export function AccessDenied({ onLogout }: { onLogout: () => void }) {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <Card className="max-w-md text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Access denied</h1>
                <p className="text-gray-600 mb-6">
                    You need an <span className="font-semibold">ADMIN</span> account to access the Control Room.
                </p>
                <button
                    onClick={onLogout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                    Log out
                </button>
            </Card>
        </div>
    );
}
