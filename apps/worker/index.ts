import { connect, consumeReminders } from "../../packages/messaging";
import { ConsoleNotifier, type Notifier, type ReminderMessage } from "../../packages/shared/utils/notifier";
import { logger } from "../../packages/shared/utils/logger";

const notifier: Notifier = new ConsoleNotifier();

await connect();
logger.info("worker started, waiting for reminder messages");

consumeReminders(async (raw) => {
    const message = JSON.parse(raw) as ReminderMessage;
    await notifier.send(message);
});