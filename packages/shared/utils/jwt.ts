import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET ?? "";
const issuer = "auction-platform";
const audience = "auction-platform-api";
const expiresIn = "7d";

export type Role = "USER" | "ADMIN";

export type JwtPayload = {
    userId: string;
    username: string;
    role: Role;
};

export function signToken(payload: JwtPayload): string {
    return jwt.sign(payload, secret, {
        algorithm: "HS256",
        issuer,
        audience,
        expiresIn,
    });
}

export function verifyToken(token: string): JwtPayload | null {
    try {
        const payload = jwt.verify(token, secret, {
            issuer,
            audience,
        }) as JwtPayload;
        if (!payload.userId || !payload.username || !payload.role) return null;
        return {
            userId: String(payload.userId),
            username: String(payload.username),
            role: payload.role === "ADMIN" ? "ADMIN" : "USER",
        };
    } catch {
        return null;
    }
}

export function getBearerToken(request: Request): string | null {
    const header = request.headers.get("authorization");
    if (header?.startsWith("Bearer ")) {
        return header.slice("Bearer ".length).trim() || null;
    }
    const cookie = request.headers.get("cookie")?.match(/(?:^|;\s*)token=([^;]+)/)?.[1];
    return cookie ?? null;
}