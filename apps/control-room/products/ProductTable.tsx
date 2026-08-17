import type { Product } from "../types";
import { formatDateTime } from "../utils/format";

export function ProductTable({ products, onEdit }: { products: Product[]; onEdit: (id: string) => void }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-200">
                        <th className="py-2 pr-4 font-medium">Image</th>
                        <th className="py-2 pr-4 font-medium">Name</th>
                        <th className="py-2 pr-4 font-medium">Auction starts</th>
                        <th className="py-2 pr-4 font-medium">Created</th>
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
                                {formatDateTime(product.auctionStartsAt)}
                            </td>
                            <td className="py-3 pr-4 text-gray-500">
                                {formatDateTime(product.createdAt)}
                            </td>
                            <td className="py-3 pr-4 text-right">
                                <button
                                    onClick={() => onEdit(product.id)}
                                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}