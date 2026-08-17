import type { ReminderEventKind } from "../../../generated/prisma/enums";
import { logger } from "./logger";

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
        logger.info(
            {
                kind: message.kind,
                userId: message.userId,
                username: message.username,
                productId: message.productId,
                productName: message.productName,
                auctionStartsAt: message.auctionStartsAt,
            },
            message.kind === "BEFORE_START" ? "reminder: 15 minutes before auction start" : "reminder: auction starting now"
        );
    }
}