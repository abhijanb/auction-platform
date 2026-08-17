import { prisma } from "../../packages/db/client";
import { connect, publishReminder } from "../../packages/messaging";

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
            console.error(`[scheduler] failed to publish event ${event.id}, will retry next tick`);
            continue;
        }

        await prisma.reminderEvent.update({
            where: { id: event.id },
            data: { sentAt: new Date() },
        });
        console.log(`[scheduler] dispatched ${event.kind} for ${message.username} -> ${message.productName}`);
    }
}

await connect();
console.log(`[scheduler] started, polling every ${POLL_INTERVAL_MS}ms`);

while (true) {
    try {
        await publishDueReminders();
    } catch (error) {
        console.error("[scheduler] tick failed", error);
    }
    await Bun.sleep(POLL_INTERVAL_MS);
}