import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET ?? "";
const issuer = "auction-platform";
const audience = "auction-platform-api";
const expiresIn = "7d";

export type JwtPayload = {
    userId: string;
    username: string;
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
        if (!payload.userId || !payload.username) return null;
        return {
            userId: String(payload.userId),
            username: String(payload.username),
        };
    } catch {
        return null;
    }
}

export function getBearerToken(request: Request): string | null {
    const header = request.headers.get("authorization");
    if (!header?.startsWith("Bearer ")) return null;
    return header.slice("Bearer ".length).trim() || null;
}