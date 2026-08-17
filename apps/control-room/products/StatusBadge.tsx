import React from "react";
import type { Product } from "../types";

export type ProductStatus = "SCHEDULED" | "LIVE" | "ENDED";

export function productStatus(product: Product): ProductStatus {
    const now = Date.now();
    const start = new Date(product.auctionStartsAt).getTime();
    if (now < start) return "SCHEDULED";
    if (!product.auctionEndsAt) return "LIVE";
    const end = new Date(product.auctionEndsAt).getTime();
    if (now < end) return "LIVE";
    return "ENDED";
}

const statusStyles: Record<ProductStatus, string> = {
    SCHEDULED: "bg-gray-100 text-gray-700",
    LIVE: "bg-green-100 text-green-700",
    ENDED: "bg-blue-100 text-blue-700",
};

export function StatusBadge({ status }: { status: ProductStatus }) {
    return (
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}>
            {status}
        </span>
    );
}