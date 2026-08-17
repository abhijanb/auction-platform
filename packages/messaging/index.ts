import amqplib, { type Channel, type ChannelModel } from "amqplib";
import { logger } from "../shared/utils/logger";

export const REMINDER_QUEUE = "auction.reminders";

let model: ChannelModel | null = null;
let channel: Channel | null = null;

export async function connect(): Promise<{ model: ChannelModel; channel: Channel }> {
    if (model && channel) return { model, channel };

    const url = process.env.RABBITMQ_URL ?? "amqp://localhost";
    model = await amqplib.connect(url);
    channel = await model.createChannel();
    await channel.assertQueue(REMINDER_QUEUE, { durable: true });
    channel.prefetch(1);
    return { model, channel };
}

export function publishReminder(message: unknown): boolean {
    if (!channel) throw new Error("Messaging not connected. Call connect() first.");
    return channel.sendToQueue(REMINDER_QUEUE, Buffer.from(JSON.stringify(message)), {
        persistent: true,
        contentType: "application/json",
    });
}

export function consumeReminders(handler: (message: string) => Promise<void>): void {
    if (!channel) throw new Error("Messaging not connected. Call connect() first.");
    channel.consume(REMINDER_QUEUE, async (msg) => {
        if (!msg) return;
        const deaths = (msg.properties.headers?.["x-death"] as Array<{ count: number }> | undefined)?.[0]?.count ?? 0;
        const redeliveries = deaths + (msg.fields.redelivered ? 1 : 0);
        logger.debug(
            { redeliveries, xDeath: deaths, redelivered: msg.fields.redelivered, message: msg.content.toString() },
            "message received"
        );
        try {
            await handler(msg.content.toString());
            logger.debug({ eventId: parseEventId(msg.content.toString()) }, "message acked");
            channel!.ack(msg);
        } catch (error) {
            logger.error(error, "handler failed, nack(requeue=true)");
            channel!.nack(msg, false, true);
        }
    });
}

function parseEventId(raw: string): string | undefined {
    try {
        return (JSON.parse(raw) as { eventId?: string }).eventId;
    } catch {
        return undefined;
    }
}

export async function close(): Promise<void> {
    await channel?.close();
    await model?.close();
    channel = null;
    model = null;
}