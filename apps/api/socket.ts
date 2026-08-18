import { createServer } from "node:http";
import { Server as SocketIOServer } from "socket.io";
import { logger } from "../../packages/shared/utils/logger";

export const httpServer = createServer();

export const io = new SocketIOServer(httpServer, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    logger.info({ socketId: socket.id }, "socket connected");

    socket.on("message", (payload) => {
        logger.info({ socketId: socket.id, payload }, "socket message");
        socket.emit("message", payload);
    });

    socket.on("disconnect", (reason) => {
        logger.info({ socketId: socket.id, reason }, "socket disconnected");
    });
});