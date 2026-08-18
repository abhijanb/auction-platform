import { io, type Socket } from "socket.io-client";
import { ENV } from "./env";
import { store } from "../store/store";

export function createSocket(): Socket {
    const token = store.getState().auth.token;

    return io(ENV.API_URL, {
        transports: ["websocket"],
        auth: { token },
    });
}