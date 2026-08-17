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

    async register(request: Request): Promise<Response> {
        const parsed = await parseBody(request, registerSchema);
        if (!parsed.ok) return parsed.response;

        try {
            await this.registerController.register(parsed.body);
            return json({ success: true, message: "User registered successfully" }, 201);
        } catch (error) {
            return json({ error: error instanceof Error ? error.message : "Registration failed" }, 400);
        }
    }

    async login(request: Request): Promise<Response> {
        const parsed = await parseBody(request, loginSchema);
        if (!parsed.ok) return parsed.response;

        return await this.loginController.login(parsed.body);
    }

    me = user(async (_request, payload) => json({ user: payload }));
}

export const authApi = new AuthApi(
    new RegisterController(),
    new LoginController()
);