import type { ReminderEventKind } from "../../../generated/prisma/enums";

export interface ReminderMessage {
    eventId: string;
    kind: ReminderEventKind;
    userId: string;
    username: string;
    productId: string;
    productName: string;
    auctionStartsAt: string;
}

export interface Notifier {
    send(message: ReminderMessage): Promise<void>;
}

export class ConsoleNotifier implements Notifier {
    async send(message: ReminderMessage): Promise<void> {
        const when = message.kind === "BEFORE_START" ? "15 minutes before start" : "at auction start";
        console.log(
            `[notify] Reminder for ${message.username} (${message.userId}) about "${message.productName}" ` +
                `(${message.productId}) ${when}. Auction starts at ${message.auctionStartsAt}.`
        );
    }
}