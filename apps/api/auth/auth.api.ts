import type { Request, Response } from "express";
import { parseBody, json } from "../../../packages/shared/utils/http";
import { loginSchema, registerSchema } from "../../../packages/shared/schemas/auth";
import { user } from "../../../packages/shared/utils/auth";
import { RegisterController } from "./controller/register.controller";
import { LoginController } from "./controller/login.controller";

class AuthApi {
    constructor(
        public registerController: RegisterController,
        public loginController: LoginController
    ) { }

    async register(req: Request, res: Response): Promise<void> {
        const parsed = await parseBody(req, registerSchema);
        if (!parsed.ok) {
            json(res, { error: parsed.error }, 400);
            return;
        }

        try {
            await this.registerController.register(parsed.body);
            json(res, { success: true, message: "User registered successfully" }, 201);
        } catch (error) {
            json(res, { error: error instanceof Error ? error.message : "Registration failed" }, 400);
        }
    }

    async registerAdmin(req: Request, res: Response): Promise<void> {
        const parsed = await parseBody(req, registerSchema);
        if (!parsed.ok) {
            json(res, { error: parsed.error }, 400);
            return;
        }

        try {
            await this.registerController.registerAdmin(parsed.body);
            json(res, { success: true, message: "Admin registered successfully" }, 201);
        } catch (error) {
            json(res, { error: error instanceof Error ? error.message : "Registration failed" }, 400);
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        const parsed = await parseBody(req, loginSchema);
        if (!parsed.ok) {
            json(res, { error: parsed.error }, 400);
            return;
        }

        await this.loginController.login(parsed.body, res);
    }

    me = user(async (_req, res, payload) => json(res, { user: payload }));
}

export const authApi = new AuthApi(
    new RegisterController(),
    new LoginController()
);