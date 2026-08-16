import { getBearerToken, verifyToken, type JwtPayload } from "./jwt";
import { json } from "./http";

export type AuthResult =
    | { ok: true; user: JwtPayload }
    | { ok: false; response: Response };

export async function requireAuth(request: Request): Promise<AuthResult> {
    const token = getBearerToken(request);
    if (!token) return { ok: false, response: json({ error: "Missing token" }, 401) };

    const payload = await verifyToken(token);
    if (!payload) return { ok: false, response: json({ error: "Invalid or expired token" }, 401) };

    return { ok: true, user: payload };
}

export async function requireAdmin(request: Request): Promise<AuthResult> {
    const auth = await requireAuth(request);
    if (!auth.ok) return auth;
    if (auth.user.role !== "ADMIN") {
        return { ok: false, response: json({ error: "Forbidden" }, 403) };
    }
    return auth;
}

type Handler = (request: Request, user: JwtPayload) => Response | Promise<Response>;

export function admin(handler: Handler): (request: Request) => Promise<Response> {
    return async (request) => {
        const auth = await requireAdmin(request);
        if (!auth.ok) return auth.response;
        return handler(request, auth.user);
    };
}

export function user(handler: Handler): (request: Request) => Promise<Response> {
    return async (request) => {
        const auth = await requireAuth(request);
        if (!auth.ok) return auth.response;
        return handler(request, auth.user);
    };
}