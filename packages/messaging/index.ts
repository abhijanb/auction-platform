import amqplib, { type Channel, type ChannelModel } from "amqplib";

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
        try {
            await handler(msg.content.toString());
            channel!.ack(msg);
        } catch (error) {
            console.error("[messaging] handler failed", error);
            channel!.nack(msg, false, true);
        }
    });
}

export async function close(): Promise<void> {
    await channel?.close();
    await model?.close();
    channel = null;
    model = null;
}