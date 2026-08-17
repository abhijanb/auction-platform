import { apiFetch } from "../api/client";
import { Card } from "../components/Card";
import { ProductForm } from "./ProductForm";

export function CreateProductView({ onDone }: { onDone: () => void }) {
    return (
        <Card className="max-w-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">New Product</h2>
            <ProductForm
                submitLabel="Create product"
                onSubmit={async (values) => {
                    await apiFetch<{ id: string }>("/admin/products", { data: values });
                    onDone();
                }}
                onCancel={onDone}
            />
        </Card>
    );
}