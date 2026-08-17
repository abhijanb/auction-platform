import { prisma } from "../../../../packages/db/client";
import { logger } from "../../../../packages/shared/utils/logger";

export class ReminderController {
    async create(userId: string, productId: string): Promise<boolean> {
        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) return false;

        const startsAt = product.auctionStartsAt;
        const beforeStart = new Date(startsAt.getTime() - 15 * 60 * 1000);
        const now = new Date();

        logger.info(
            {
                userId,
                productId,
                productName: product.name,
                auctionStartsAt: startsAt.toISOString(),
                beforeStart: beforeStart.toISOString(),
                beforeStartIsPast: beforeStart < now,
                minutesUntilAuction: (startsAt.getTime() - now.getTime()) / 60000,
            },
            "reminder created"
        );
        await prisma.productReminder.upsert({
            where: { userId_productId: { userId, productId } },
            create: {
                userId,
                productId,
                events: {
                    create: [
                        { kind: "BEFORE_START", scheduledAt: beforeStart },
                        { kind: "AT_START", scheduledAt: startsAt },
                    ],
                },
            },
            update: {},
        });
        return true;
    }

    async remove(userId: string, productId: string): Promise<void> {
        await prisma.productReminder.deleteMany({ where: { userId, productId } });
    }

    listByUser(userId: string) {
        return prisma.productReminder.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            include: { product: true },
        });
    }
}