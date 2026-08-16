import { authApi } from "./api/auth/auth.api";
import { ENV } from "./env";

const server = Bun.serve({
    port: 3000,
    fetch(req) {
        const url = new URL(req.url);
        switch (url.pathname) {
            case "/":
                return new Response("Hello, world!");
            case "/register":
                return authApi.register(req);
            default:
                return new Response("Not Found", { status: 404 });
        }

    },
    development: ENV.ENVIRONMENT === "development",
});

console.log(`Server running at http://${server.hostname}:${server.port}`);
