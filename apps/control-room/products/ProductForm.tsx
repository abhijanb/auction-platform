import React, { useState } from "react";
import { createProductSchema } from "../../../packages/shared/schemas/product";
import { ErrorBanner } from "../components/ErrorBanner";
import { toDatetimeLocal, toIso } from "../utils/format";

interface ProductFormProps {
    initial?: { name?: string; image?: string; auctionStartsAt?: string };
    submitLabel: string;
    onSubmit: (values: { name: string; image: string; auctionStartsAt?: string }) => Promise<void>;
    onCancel: () => void;
}

export function ProductForm({ initial, submitLabel, onSubmit, onCancel }: ProductFormProps) {
    const [name, setName] = useState(initial?.name ?? "");
    const [image, setImage] = useState(initial?.image ?? "");
    const [auctionStartsAt, setAuctionStartsAt] = useState(
        initial?.auctionStartsAt ? toDatetimeLocal(initial.auctionStartsAt) : "",
    );
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    async function handleSubmit(event: React.FormEvent): Promise<void> {
        event.preventDefault();
        setError(null);

        const parsed = createProductSchema.safeParse({
            name,
            image,
            auctionStartsAt: auctionStartsAt ? toIso(auctionStartsAt) : undefined,
        });
        if (!parsed.success) {
            const first = parsed.error.issues[0];
            setError(first ? `${first.path.join(".")}: ${first.message}` : "Invalid input");
            return;
        }

        setSaving(true);
        try {
            await onSubmit(parsed.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save product");
        } finally {
            setSaving(false);
        }
    }

    const inputClass =
        "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                </label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={200}
                    required
                    className={inputClass}
                />
            </div>
            <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                </label>
                <input
                    id="image"
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    required
                    className={inputClass}
                />
            </div>
            <div>
                <label htmlFor="auctionStartsAt" className="block text-sm font-medium text-gray-700 mb-1">
                    Auction starts at
                </label>
                <input
                    id="auctionStartsAt"
                    type="datetime-local"
                    value={auctionStartsAt}
                    onChange={(e) => setAuctionStartsAt(e.target.value)}
                    className={inputClass}
                />
            </div>
            {error && <ErrorBanner message={error} />}
            <div className="flex items-center gap-3 pt-2">
                <button
                    type="submit"
                    disabled={saving}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                    {saving ? "Saving…" : submitLabel}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="text-gray-600 hover:text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}