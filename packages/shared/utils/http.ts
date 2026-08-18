import { z } from "zod";
import type { Request, Response } from "express";

export function json(res: Response, body: unknown, status = 200): void {
    res.status(status).json(body);
}

type ParseResult<T> =
    | { ok: true; body: T }
    | { ok: false; error: unknown };

export async function parseBody<T>(
    req: Request,
    schema: z.ZodType<T>,
): Promise<ParseResult<T>> {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return { ok: false, error: result.error.flatten() };
    }
    return { ok: true, body: result.data };
}