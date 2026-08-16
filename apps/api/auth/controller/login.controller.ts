import { prisma } from "../../../../packages/db/client";
import type { LoginBody } from "../../../../packages/shared/schemas/auth";
import { verifyPassword } from "../../../../packages/shared/utils/password";
import { signToken } from "../../../../packages/shared/utils/jwt";

export class LoginController {
    async login({ username, password }: LoginBody) {
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        if (!(await verifyPassword(password, user.password))) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        const token = signToken({ userId: user.id, username: user.username });

        // token set as cookie

        return new Response(JSON.stringify({ token, user: { id: user.id, username: user.username }, headers: { "Set-Cookie": `token=${token}; Path=/; HttpOnly` } }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
}