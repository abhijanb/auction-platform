import React from "react";
import type { Product } from "../types";
import { formatDateTime } from "../utils/format";
import { productStatus, StatusBadge } from "./StatusBadge";

export function ProductTable({ products, onEdit, onDelete, deleting = false }: {
    products: Product[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    deleting?: boolean;
}) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-200">
                        <th className="py-2 pr-4 font-medium">Image</th>
                        <th className="py-2 pr-4 font-medium">Name</th>
                        <th className="py-2 pr-4 font-medium">Starting price</th>
                        <th className="py-2 pr-4 font-medium">Starts</th>
                        <th className="py-2 pr-4 font-medium">Ends</th>
                        <th className="py-2 pr-4 font-medium">Status</th>
                        <th className="py-2 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id} className="border-b border-gray-100">
                            <td className="py-3 pr-4">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-12 h-12 rounded-lg object-cover"
                                />
                            </td>
                            <td className="py-3 pr-4 font-medium text-gray-900">{product.name}</td>
                            <td className="py-3 pr-4 text-gray-600">
                                {product.startingPrice !== null ? `NPR ${product.startingPrice}` : "—"}
                            </td>
                            <td className="py-3 pr-4 text-gray-600">
                                {formatDateTime(product.auctionStartsAt)}
                            </td>
                            <td className="py-3 pr-4 text-gray-600">
                                {product.auctionEndsAt ? formatDateTime(product.auctionEndsAt) : "—"}
                            </td>
                            <td className="py-3 pr-4">
                                <StatusBadge status={productStatus(product)} />
                            </td>
                            <td className="py-3 pr-4 text-right whitespace-nowrap">
                                <button
                                    onClick={() => onEdit(product.id)}
                                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(product.id)}
                                    disabled={deleting}
                                    className="ml-1 px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}