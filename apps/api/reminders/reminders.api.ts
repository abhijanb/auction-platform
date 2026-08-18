import { json } from "../../../packages/shared/utils/http";
import { user } from "../../../packages/shared/utils/auth";
import { ReminderController } from "./controller/reminder.controller";

class RemindersApi {
    constructor(private reminderController: ReminderController) {}

    publicSetReminder = user(async (req, res, auth) => {
        const productId = req.params.id as string;
        const created = await this.reminderController.create(auth.userId, productId);
        if (!created) return json(res, { error: "Product not found" }, 404);
        json(res, { success: true, productId, reminded: true }, 201);
    });

    publicRemoveReminder = user(async (req, res, auth) => {
        const productId = req.params.id as string;
        await this.reminderController.remove(auth.userId, productId);
        json(res, { success: true, productId, reminded: false });
    });

    publicMyReminders = user(async (_req, res, auth) => {
        const reminders = await this.reminderController.listByUser(auth.userId);
        json(res, { reminders });
    });
}

export const remindersApi = new RemindersApi(new ReminderController());