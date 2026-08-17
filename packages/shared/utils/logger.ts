import { pino } from "pino";

const isDev = (process.env.ENVIRONMENT ?? "development") === "development";

export const logger = pino({
    level: process.env.LOG_LEVEL ?? "info",
    ...(isDev && {
        transport: {
            target: "pino-pretty",
            options: {
                colorize: true,
                translateTime: "HH:MM:ss",
                ignore: "pid,hostname",
            },
        },
    }),
});