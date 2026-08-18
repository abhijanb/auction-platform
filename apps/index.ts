import { mkdirSync } from "node:fs";
import { join } from "node:path";
import express from "express";
import cors from "cors";
import { authApi } from "./api/auth/auth.api";
import { productsApi } from "./api/products/products.api";
import { remindersApi } from "./api/reminders/reminders.api";
import { uploadsApi, serveUpload, uploadSingle } from "./api/uploads/uploads.api";
import { httpServer } from "./api/socket";
import { ENV } from "./env";
import { logger } from "../packages/shared/utils/logger";

const CONTROL_ROOM_DIST = join(import.meta.dir, "control-room-dist");

async function buildControlRoom(): Promise<void> {
    mkdirSync(CONTROL_ROOM_DIST, { recursive: true });
    await Bun.build({
        entrypoints: [join(import.meta.dir, "control-room/index.html")],
        outdir: CONTROL_ROOM_DIST,
        target: "browser",
    });
}

await buildControlRoom();

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (_req, res) => res.send("Hello, world!"));
app.get("/dashboard", (_req, res) => res.sendFile(join(CONTROL_ROOM_DIST, "index.html")));
app.use(express.static(CONTROL_ROOM_DIST));

app.post("/register", authApi.register.bind(authApi));
app.post("/register-admin", authApi.registerAdmin.bind(authApi));
app.post("/login", authApi.login.bind(authApi));
app.get("/me", authApi.me.bind(authApi));

app.get("/products", productsApi.publicList.bind(productsApi));
app.get("/products/:id", productsApi.publicGetById.bind(productsApi));
app.post("/products/:id/remind", remindersApi.publicSetReminder.bind(remindersApi));
app.delete("/products/:id/remind", remindersApi.publicRemoveReminder.bind(remindersApi));
app.get("/me/reminders", remindersApi.publicMyReminders.bind(remindersApi));

app.get("/admin/products", productsApi.list.bind(productsApi));
app.post("/admin/products", productsApi.create.bind(productsApi));
app.get("/admin/products/:id", productsApi.getById.bind(productsApi));
app.put("/admin/products/:id", productsApi.update.bind(productsApi));
app.delete("/admin/products/:id", productsApi.delete.bind(productsApi));

app.post("/admin/uploads", uploadSingle, uploadsApi.upload.bind(uploadsApi));
app.get("/uploads/:file", serveUpload);

httpServer.on("request", app);
httpServer.listen(3000, () => {
    logger.info({ hostname: "0.0.0.0", port: 3000, environment: ENV.ENVIRONMENT }, "server running");
});