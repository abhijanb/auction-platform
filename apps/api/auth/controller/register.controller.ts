import { prisma } from "../../../../packages/db/client";
import type { RegisterBody } from "../../../../packages/shared/schemas/auth";
import { hashPassword } from "../../../../packages/shared/utils/password";

export class RegisterController {
    async register(user: RegisterBody): Promise<void> {
        // check if the username already exists
        try {

            const existingUser = await prisma.user.findUnique({
                where: { username: user.username },
            });

            if (existingUser) {
                throw new Error("Username already exists");
            }

            await prisma.user.create({
                data: {
                    username: user.username,
                    password: await hashPassword(user.password),
                },
            });
            return;
        }
        catch (error: any) {
            // prisma error handling
            if (error.code === "P2002") {
                throw new Error("Username already exists");
            }
            if (error.code === "P2003") {
                throw new Error("Foreign key constraint failed");
            }
            throw new Error(`Failed to register user: ${error.message}`);
        }
    }
}