import React, { useRef, useState } from "react";
import { createProductSchema } from "../../../packages/shared/schemas/product";
import { apiFetch } from "../api/client";
import { ErrorBanner } from "../components/ErrorBanner";
import { toDatetimeLocal, toIso } from "../utils/format";

interface ProductFormValues {
    name: string;
    image: string;
    startingPrice: number;
    auctionStartsAt?: string;
    auctionEndsAt?: string;
}

interface ProductFormProps {
    initial?: {
        name?: string;
        image?: string;
        startingPrice?: string | null;
        auctionStartsAt?: string;
        auctionEndsAt?: string | null;
    };
    submitLabel: string;
    onSubmit: (values: ProductFormValues) => Promise<void>;
    onCancel: () => void;
}

export function ProductForm({ initial, submitLabel, onSubmit, onCancel }: ProductFormProps) {
    const [name, setName] = useState(initial?.name ?? "");
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(initial?.image ?? null);
    const [startingPrice, setStartingPrice] = useState(initial?.startingPrice ?? "");
    const [auctionStartsAt, setAuctionStartsAt] = useState(
        initial?.auctionStartsAt ? toDatetimeLocal(initial.auctionStartsAt) : "",
    );
    const [auctionEndsAt, setAuctionEndsAt] = useState(
        initial?.auctionEndsAt ? toDatetimeLocal(initial.auctionEndsAt) : "",
    );
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const fileInput = useRef<HTMLInputElement>(null);

    async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
        const selected = event.target.files?.[0] ?? null;
        setFile(selected);
        setError(null);
        if (!selected) {
            setPreview(initial?.image ?? null);
            return;
        }
        if (!selected.type.startsWith("image/")) {
            setFile(null);
            setPreview(initial?.image ?? null);
            setError("Please choose an image file");
            return;
        }
        setPreview(URL.createObjectURL(selected));
    }

    async function handleSubmit(event: React.FormEvent): Promise<void> {
        event.preventDefault();
        setError(null);

        let image = initial?.image ?? "";
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            try {
                const uploaded = await apiFetch<{ url: string }>("/admin/uploads", { data: formData });
                image = uploaded.url;
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to upload image");
                return;
            }
        }

        const parsed = createProductSchema.safeParse({
            name,
            image,
            startingPrice: startingPrice === "" ? undefined : Number(startingPrice),
            auctionStartsAt: auctionStartsAt ? toIso(auctionStartsAt) : undefined,
            auctionEndsAt: auctionEndsAt ? toIso(auctionEndsAt) : undefined,
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
                    Image
                </label>
                {preview && (
                    <div className="mb-2">
                        <img src={preview} alt="Preview" className="w-24 h-24 rounded-lg object-cover" />
                    </div>
                )}
                <input
                    id="image"
                    ref={fileInput}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={handleFileChange}
                    className={inputClass}
                />
            </div>
            <div>
                <label htmlFor="startingPrice" className="block text-sm font-medium text-gray-700 mb-1">
                    Starting price (NPR)
                </label>
                <input
                    id="startingPrice"
                    type="number"
                    min={0}
                    step="0.01"
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(e.target.value)}
                    required
                    className={inputClass}
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="auctionStartsAt" className="block text-sm font-medium text-gray-700 mb-1">
                        Auction starts at
                    </label>
                    <input
                        id="auctionStartsAt"
                        type="datetime-local"
                        value={auctionStartsAt}
                        onChange={(e) => setAuctionStartsAt(e.target.value)}
                        min={toDatetimeLocal(new Date().toISOString())}
                        required
                        className={inputClass}
                    />
                </div>
                <div>
                    <label htmlFor="auctionEndsAt" className="block text-sm font-medium text-gray-700 mb-1">
                        Auction ends at
                    </label>
                    <input
                        id="auctionEndsAt"
                        type="datetime-local"
                        value={auctionEndsAt}
                        onChange={(e) => setAuctionEndsAt(e.target.value)}
                        min={auctionStartsAt || toDatetimeLocal(new Date().toISOString())}
                        required
                        className={inputClass}
                    />
                </div>
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