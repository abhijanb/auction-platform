import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import type { Product } from "../types";
import { Card } from "../components/Card";
import { ErrorBanner } from "../components/ErrorBanner";
import { ProductForm } from "./ProductForm";

export function EditProductView({ id, onDone }: { id: string; onDone: () => void }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        apiFetch<Product>(`/admin/products/${id}`)
            .then(setProduct)
            .catch((err) => setError(err instanceof Error ? err.message : "Failed to load product"));
    }, [id]);

    if (error) {
        return (
            <Card>
                <ErrorBanner message={error} />
            </Card>
        );
    }

    if (!product) {
        return <Card><p className="text-gray-500">Loading product…</p></Card>;
    }

    return (
        <Card className="max-w-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Product</h2>
            <ProductForm
                initial={product}
                submitLabel="Save changes"
                onSubmit={async (values) => {
                    await apiFetch<{ id: string }>(`/admin/products/${id}`, {
                        method: "PUT",
                        data: values,
                    });
                    onDone();
                }}
                onCancel={onDone}
            />
        </Card>
    );
}