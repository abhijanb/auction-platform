import type { Request, Response } from "express";
import { getBearerToken, verifyToken, type JwtPayload } from "./jwt";
import { prisma } from "../../db/client";

export type AuthResult =
    | { ok: true; user: JwtPayload }
    | { ok: false; status: number; error: string };

export async function requireAuth(req: Request): Promise<AuthResult> {
    const token = getBearerToken(req);
    if (!token) return { ok: false, status: 401, error: "Missing token" };

    const payload = await verifyToken(token);
    if (!payload) return { ok: false, status: 401, error: "Invalid or expired token" };

    const dbUser = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, username: true, role: true },
    });
    if (!dbUser) return { ok: false, status: 401, error: "User not found" };

    return {
        ok: true,
        user: {
            userId: dbUser.id,
            username: dbUser.username,
            role: dbUser.role,
        },
    };
}

export async function requireAdmin(req: Request): Promise<AuthResult> {
    const auth = await requireAuth(req);
    if (!auth.ok) return auth;
    if (auth.user.role !== "ADMIN") {
        return { ok: false, status: 403, error: "Forbidden" };
    }
    return auth;
}

type Handler = (req: Request, res: Response, user: JwtPayload) => void | Promise<void>;

export function admin(handler: Handler) {
    return async (req: Request, res: Response): Promise<void> => {
        const auth = await requireAdmin(req);
        if (!auth.ok) {
            res.status(auth.status).json({ error: auth.error });
            return;
        }
        await handler(req, res, auth.user);
    };
}

export function user(handler: Handler) {
    return async (req: Request, res: Response): Promise<void> => {
        const auth = await requireAuth(req);
        if (!auth.ok) {
            res.status(auth.status).json({ error: auth.error });
            return;
        }
        await handler(req, res, auth.user);
    };
}