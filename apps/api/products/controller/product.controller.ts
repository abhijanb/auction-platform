import { prisma } from "../../../../packages/db/client";

interface ProductInput {
    name: string;
    image: string;
    startingPrice?: number;
    auctionStartsAt?: string;
    auctionEndsAt?: string;
}

export class ProductController {
    async create(data: ProductInput) {
        return prisma.product.create({
            data: {
                name: data.name,
                image: data.image,
                startingPrice: data.startingPrice ?? undefined,
                auctionStartsAt: data.auctionStartsAt
                    ? new Date(data.auctionStartsAt)
                    : undefined,
                auctionEndsAt: data.auctionEndsAt
                    ? new Date(data.auctionEndsAt)
                    : undefined,
            },
        });
    }

    async list() {
        return prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    }

    async getById(id: string) {
        return prisma.product.findUnique({ where: { id } });
    }

    async update(id: string, data: Partial<ProductInput>) {
        return prisma.product.update({
            where: { id },
            data: {
                name: data.name,
                image: data.image,
                startingPrice: data.startingPrice,
                auctionStartsAt: data.auctionStartsAt
                    ? new Date(data.auctionStartsAt)
                    : undefined,
                auctionEndsAt: data.auctionEndsAt
                    ? new Date(data.auctionEndsAt)
                    : undefined,
            },
        });
    }

    async delete(id: string) {
        return prisma.product.delete({ where: { id } });
    }
}