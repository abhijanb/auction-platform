import type { Request, Response } from "express";
import { prisma } from "../../../../packages/db/client";
import type { LoginBody } from "../../../../packages/shared/schemas/auth";
import { verifyPassword } from "../../../../packages/shared/utils/password";
import { signToken } from "../../../../packages/shared/utils/jwt";

export class LoginController {
    async login({ username, password }: LoginBody, res: Response) {
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        if (!(await verifyPassword(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = signToken({ userId: user.id, username: user.username, role: user.role });

        return res
            .set("Set-Cookie", `token=${token}; Path=/; HttpOnly; SameSite=Lax`)
            .status(200)
            .json({ token, user: { id: user.id, username: user.username, role: user.role } });
    }
}