import { authApi } from "./api/auth/auth.api";
import { productsApi } from "./api/products/products.api";
import { remindersApi } from "./api/reminders/reminders.api";
import controlRoom from "./control-room/index.html";
import { ENV } from "./env";

const server = Bun.serve({
    port: 3000,
    routes: {
        "/dashboard": controlRoom,
        "/": new Response("Hello, world!"),
        "/register": {
            POST: (req) => authApi.register(req),
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
    },
    development: ENV.ENVIRONMENT === "development",
});

console.log(`Server running at http://${server.hostname}:${server.port}`);