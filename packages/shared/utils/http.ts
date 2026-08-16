import { z } from "zod";

export function json(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
    });
}

type ParseResult<T> =
    | { ok: true; body: T }
    | { ok: false; response: Response };

export async function parseBody<T>(
    request: Request,
    schema: z.ZodType<T>,
): Promise<ParseResult<T>> {
    const contentType = request.headers.get("content-type") ?? "";
    let raw: unknown;
    try {
        if (contentType.includes("application/json")) {
            raw = await request.json();
        } else if (contentType.includes("application/x-www-form-urlencoded")) {
            raw = Object.fromEntries((await request.formData()).entries());
        } else {
            return {
                ok: false,
                response: new Response("Unsupported content-type", { status: 415 }),
            };
        }
    } catch {
        return {
            ok: false,
            response: new Response("Invalid request body", { status: 400 }),
        };
    }

    const result = schema.safeParse(raw);
    if (!result.success) {
        return {
            ok: false,
            response: new Response(
                JSON.stringify({ error: result.error.flatten() }),
                { status: 400, headers: { "Content-Type": "application/json" } },
            ),
        };
    }
    return { ok: true, body: result.data };
}