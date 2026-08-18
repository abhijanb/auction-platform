import { createServer } from "node:http";
import { Server as SocketIOServer, type Socket } from "socket.io";
import { verifyToken, type JwtPayload } from "../../packages/shared/utils/jwt";
import { logger } from "../../packages/shared/utils/logger";
import { registerAuctionSocketHandlers } from "./auction/auction.socket";

export const httpServer = createServer();

export const io = new SocketIOServer(httpServer, {
    cors: {
        origin: "*",
    },
});

interface AuctionSocketData {
    user?: JwtPayload;
}

io.use((socket: Socket<AuctionSocketData>, next) => {
    const token = socket.handshake.auth?.token;
    if (typeof token !== "string" || !token) {
        return next(new Error("Unauthorized"));
    }
    const user = verifyToken(token);
    if (!user) {
        return next(new Error("Unauthorized"));
    }
    socket.data.user = user;
    next();
});

io.on("connection", (socket) => {
    const user = socket.data.user;
    logger.info({ socketId: socket.id, userId: user?.userId }, "socket connected");

    if (user) {
        registerAuctionSocketHandlers(socket, user);
    }

    socket.on("message", (payload) => {
        logger.info({ socketId: socket.id, payload }, "socket message");
        socket.emit("message", payload);
    });

    socket.on("disconnect", (reason) => {
        logger.info({ socketId: socket.id, userId: user?.userId, reason }, "socket disconnected");
    });
});