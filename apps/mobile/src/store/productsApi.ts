import { baseApi } from "./baseApi";

export interface Product {
    id: string;
    name: string;
    image: string;
    startingPrice: string | null;
    auctionStartsAt: string;
    auctionEndsAt?: string | null;
    createdAt: string;
}

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

export const productsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query<Product[], void>({
            query: () => "/products",
        }),
    }),
});

export const { useGetProductsQuery } = productsApi;