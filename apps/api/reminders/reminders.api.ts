import { json } from "../../../packages/shared/utils/http";
import { user } from "../../../packages/shared/utils/auth";
import { ReminderController } from "./controller/reminder.controller";

type RouteRequest = Request & { params: Record<string, string> };

class RemindersApi {
    constructor(private reminderController: ReminderController) {}

    publicSetReminder = user(async (request, user) => {
        const productId = this.idFrom(request);
        const created = await this.reminderController.create(user.userId, productId);
        if (!created) return json({ error: "Product not found" }, 404);
        return json({ success: true, productId, reminded: true }, 201);
    });

    publicRemoveReminder = user(async (request, user) => {
        const productId = this.idFrom(request);
        await this.reminderController.remove(user.userId, productId);
        return json({ success: true, productId, reminded: false });
    });

    publicMyReminders = user(async (_request, user) => {
        const reminders = await this.reminderController.listByUser(user.userId);
        return json({ reminders });
    });

    private idFrom(request: Request): string {
        return (request as RouteRequest).params.id!;
    }
}

export const remindersApi = new RemindersApi(new ReminderController());