import type { Socket } from "socket.io";
import { prisma } from "../../../packages/db/client";
import type { JwtPayload } from "../../../packages/shared/utils/jwt";
import { logger } from "../../../packages/shared/utils/logger";

function roomFor(productId: string): string {
    return `product:${productId}`;
}

export function registerAuctionSocketHandlers(socket: Socket, user: JwtPayload) {
    socket.on("bid:join", async ({ productId }: { productId?: string } = {}) => {
        if (!productId) {
            socket.emit("bid:join_error", { error: "Missing productId" });
            return;
        }

        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) {
            socket.emit("bid:join_error", { error: "Product not found" });
            return;
        }

        const now = Date.now();
        const start = new Date(product.auctionStartsAt).getTime();
        const end = product.auctionEndsAt ? new Date(product.auctionEndsAt).getTime() : null;
        if (now < start || (end !== null && now >= end)) {
            socket.emit("bid:join_error", { error: "Auction is not live" });
            return;
        }

        socket.join(roomFor(productId));
        logger.info({ socketId: socket.id, userId: user.userId, productId }, "bid:join");

        socket.emit("bid:joined", {
            productId,
            status: "LIVE",
            currentPrice: product.startingPrice ?? 0,
            auctionEndsAt: product.auctionEndsAt,
        });
    });

    socket.on("bid:leave", ({ productId }: { productId?: string } = {}) => {
        if (!productId) return;
        socket.leave(roomFor(productId));
        logger.info({ socketId: socket.id, userId: user.userId, productId }, "bid:leave");
        socket.emit("bid:left", { productId });
    });
}