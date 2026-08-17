const CORS_HEADERS: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
};

type Handler = (request: Request, ...args: unknown[]) => Promise<Response> | Response;

export function withCors(handler: Handler): Handler {
    return async (request, ...args) => {
        if (request.method === "OPTIONS") {
            return new Response(null, { status: 204, headers: CORS_HEADERS });
        }
        const response = await handler(request, ...args);
        const headers = new Headers(response.headers);
        for (const [name, value] of Object.entries(CORS_HEADERS)) {
            headers.set(name, value);
        }
        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers,
        });
    };
}
