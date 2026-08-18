import { io, type Socket } from "socket.io-client";
import { ENV } from "./env";
import { store } from "../store/store";

let socket: Socket | null = null;

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