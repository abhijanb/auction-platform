const procs = [
    Bun.spawn(["bun", "--watch", "apps/index.ts"], { stdio: ["ignore", "inherit", "inherit"] }),
    Bun.spawn(["bun", "apps/worker/index.ts"], { stdio: ["ignore", "inherit", "inherit"] }),
    Bun.spawn(["bun", "apps/scheduler/index.ts"], { stdio: ["ignore", "inherit", "inherit"] }),
];

const stop = () => {
    procs.forEach((p) => p.kill());
    process.exit(0);
};

process.on("SIGINT", stop);
process.on("SIGTERM", stop);

await Promise.all(procs.map((p) => p.exited));