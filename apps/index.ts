import { authApi } from "./api/auth/auth.api";
import { productsApi } from "./api/products/products.api";
import { remindersApi } from "./api/reminders/reminders.api";
import { uploadsApi, serveUpload } from "./api/uploads/uploads.api";
import controlRoom from "./control-room/index.html";
import { ENV } from "./env";
import { logger } from "../packages/shared/utils/logger";

const server = Bun.serve({
    port: 3000,
    routes: {
        "/dashboard": controlRoom,
        "/": new Response("Hello, world!"),
        "/register": {
            POST: (req) => authApi.register(req),
        },
        "/register-admin": {
            POST: (req) => authApi.registerAdmin(req),
        },
        "/login": {
            POST: (req) => authApi.login(req),
        },
        "/me": {
            GET: (req) => authApi.me(req),
        },
        "/products": {
            GET: (req) => productsApi.publicList(req),
        },
        "/products/:id": {
            GET: (req) => productsApi.publicGetById(req),
        },
        "/products/:id/remind": {
            POST: (req) => remindersApi.publicSetReminder(req),
            DELETE: (req) => remindersApi.publicRemoveReminder(req),
        },
        "/me/reminders": {
            GET: (req) => remindersApi.publicMyReminders(req),
        },
        "/admin/products": {
            GET: (req) => productsApi.list(req),
            POST: (req) => productsApi.create(req),
        },
        "/admin/products/:id": {
            GET: (req) => productsApi.getById(req),
            PUT: (req) => productsApi.update(req),
            DELETE: (req) => productsApi.delete(req),
        },
        "/admin/uploads": {
            POST: (req) => uploadsApi.upload(req),
        },
        "/uploads/:file": {
            GET: (req) => serveUpload((req as Request & { params: Record<string, string> }).params),
        },
    },
    development: ENV.ENVIRONMENT === "development",
});

logger.info({ hostname: server.hostname, port: server.port }, "server running");