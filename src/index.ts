const server = Bun.serve({
    port: 3000,
    fetch(req) {
        const url = new URL(req.url);
        switch (url.pathname) {
            case "/":
                return new Response("Hello, world!");
            default:
                return new Response("Not Found", { status: 404 });
        }

    },
});

console.log(`Server running at http://${server.hostname}:${server.port}`);
