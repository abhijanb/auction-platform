import React, { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import type { Product } from "../types";
import { Card } from "../components/Card";
import { ErrorBanner } from "../components/ErrorBanner";
import { ProductTable } from "./ProductTable";

export function ProductsView({ onEdit }: { onEdit: (id: string) => void }) {
    const [products, setProducts] = useState<Product[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const load = useCallback(async () => {
        setError(null);
        try {
            setProducts(await apiFetch<Product[]>("/admin/products"));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load products");
            setProducts([]);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    async function handleDelete(id: string): Promise<void> {
        const product = products?.find((p) => p.id === id);
        if (!window.confirm(`Delete "${product?.name ?? "this product"}"? This cannot be undone.`)) return;

        setDeleting(true);
        setError(null);
        try {
            await apiFetch<{ success: boolean }>(`/admin/products/${id}`, { method: "DELETE" });
            await load();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete product");
        } finally {
            setDeleting(false);
        }
    }

    return (
        <Card>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Products</h2>
                <span className="text-sm text-gray-500">
                    {products ? `${products.length} item(s)` : "Loading…"}
                </span>
            </div>

            {error && <div className="mb-4"><ErrorBanner message={error} /></div>}

            {products === null ? (
                <p className="text-gray-500">Loading products…</p>
            ) : products.length === 0 ? (
                <p className="text-gray-500">No products yet.</p>
            ) : (
                <ProductTable
                    products={products}
                    onEdit={onEdit}
                    onDelete={handleDelete}
                    deleting={deleting}
                />
            )}
        </Card>
    );
}