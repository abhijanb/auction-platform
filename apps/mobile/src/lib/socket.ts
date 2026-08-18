import { io, type Socket } from "socket.io-client";
import { ENV } from "./env";
import { store } from "../store/store";

let socket: Socket | null = null;

export interface BidJoined {
    productId: string;
    status: string;
    currentPrice: number | string | null;
    auctionEndsAt: string | null;
}

export function connectSocket(): Socket {
    if (socket) return socket;

    const token = store.getState().auth.token;

    socket = io(ENV.API_URL, {
        transports: ["websocket"],
        auth: { token },
    });

    socket.on("disconnect", () => {
        socket = null;
    });

    return socket;
}

export function disconnectSocket(): void {
    socket?.disconnect();
    socket = null;
}

export function joinAuction(socket: Socket, productId: string): void {
    socket.emit("bid:join", { productId });
}

export function leaveAuction(socket: Socket, productId: string): void {
    socket.emit("bid:leave", { productId });
}