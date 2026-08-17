import { prisma } from "../../packages/db/client";
import { connect, publishReminder } from "../../packages/messaging";
import { logger } from "../../packages/shared/utils/logger";

const POLL_INTERVAL_MS = 30_000;

async function publishDueReminders(): Promise<void> {
    const due = await prisma.reminderEvent.findMany({
        where: { sentAt: null, scheduledAt: { lte: new Date() } },
        include: { reminder: { include: { product: true, user: true } } },
    });

    for (const event of due) {
        const { reminder } = event;
        const message = {
            eventId: event.id,
            kind: event.kind,
            userId: reminder.userId,
            username: reminder.user.username,
            productId: reminder.productId,
            productName: reminder.product.name,
            auctionStartsAt: reminder.product.auctionStartsAt.toISOString(),
        };

        const ok = publishReminder(message);
        if (!ok) {
            logger.error({ eventId: event.id }, "failed to publish event, will retry next tick");
            continue;
        }

        const delayMs = Date.now() - event.scheduledAt.getTime();
        logger.info(
            {
                kind: event.kind,
                username: message.username,
                productName: message.productName,
                scheduledAt: event.scheduledAt.toISOString(),
                dispatchedAfterSeconds: Math.round(delayMs / 1000),
            },
            "dispatched reminder"
        );

        await prisma.reminderEvent.update({
            where: { id: event.id },
            data: { sentAt: new Date() },
        });
    }
}

await connect();
logger.info({ pollIntervalMs: POLL_INTERVAL_MS }, "scheduler started");

while (true) {
    try {
        await publishDueReminders();
    } catch (error) {
        logger.error(error, "scheduler tick failed");
    }
    await Bun.sleep(POLL_INTERVAL_MS);
}