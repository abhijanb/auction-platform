import { authApi } from "./api/auth/auth.api";
import { productsApi } from "./api/products/products.api";
import { remindersApi } from "./api/reminders/reminders.api";
import { uploadsApi, serveUpload } from "./api/uploads/uploads.api";
import { withCors } from "./api/cors";
import controlRoom from "./control-room/index.html";
import { ENV } from "./env";
import { logger } from "../packages/shared/utils/logger";

const server = Bun.serve({
    port: 3000,
    routes: {
        "/dashboard": controlRoom,
        "/": new Response("Hello, world!"),
        "/register": {
            POST: (req) => withCors(authApi.register.bind(authApi))(req),
        },
        "/register-admin": {
            POST: (req) => withCors(authApi.registerAdmin.bind(authApi))(req),
        },
        "/login": {
            POST: (req) => withCors(authApi.login.bind(authApi))(req),
        },
        "/me": {
            GET: (req) => withCors(authApi.me.bind(authApi))(req),
        },
        "/products": {
            GET: (req) => withCors(productsApi.publicList.bind(productsApi))(req),
        },
        "/products/:id": {
            GET: (req) => withCors(productsApi.publicGetById.bind(productsApi))(req),
        },
        "/products/:id/remind": {
            POST: (req) => withCors(remindersApi.publicSetReminder.bind(remindersApi))(req),
            DELETE: (req) => withCors(remindersApi.publicRemoveReminder.bind(remindersApi))(req),
        },
        "/me/reminders": {
            GET: (req) => withCors(remindersApi.publicMyReminders.bind(remindersApi))(req),
        },
        "/admin/products": {
            GET: (req) => withCors(productsApi.list.bind(productsApi))(req),
            POST: (req) => withCors(productsApi.create.bind(productsApi))(req),
        },
        "/admin/products/:id": {
            GET: (req) => withCors(productsApi.getById.bind(productsApi))(req),
            PUT: (req) => withCors(productsApi.update.bind(productsApi))(req),
            DELETE: (req) => withCors(productsApi.delete.bind(productsApi))(req),
        },
        "/admin/uploads": {
            POST: (req) => withCors(uploadsApi.upload.bind(uploadsApi))(req),
        },
        "/uploads/:file": {
            GET: (req) =>
                withCors((r: Request) =>
                    serveUpload((r as Request & { params: Record<string, string> }).params),
                )(req),
        },
    },
    fetch: (request) => {
        if (request.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                    "Access-Control-Max-Age": "86400",
                },
            });
        }
        return new Response("Not Found", { status: 404 });
    },
    development: ENV.ENVIRONMENT === "development",
});

logger.info({ hostname: server.hostname, port: server.port }, "server running");