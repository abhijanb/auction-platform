import { prisma } from "../../../../packages/db/client";

export class ProductController {
    async create(data: { name: string; image: string }) {
        return prisma.product.create({ data });
    }

    async list() {
        return prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    }

    async getById(id: string) {
        return prisma.product.findUnique({ where: { id } });
    }

    async update(id: string, data: { name?: string; image?: string }) {
        return prisma.product.update({ where: { id }, data });
    }

    async delete(id: string) {
        return prisma.product.delete({ where: { id } });
    }
}