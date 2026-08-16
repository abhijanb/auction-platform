import { parseBody } from "../../../packages/shared/utils/http";
import { loginSchema, registerSchema } from "../../../packages/shared/schemas/auth";
import { getBearerToken, verifyToken } from "../../../packages/shared/utils/jwt";
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

        await this.registerController.register(parsed.body);
        return new Response("User registered successfully", { status: 201 });
    }

    async login(request: Request): Promise<Response> {
        const parsed = await parseBody(request, loginSchema);
        if (!parsed.ok) return parsed.response;

        return await this.loginController.login(parsed.body);
    }

    async me(request: Request): Promise<Response> {
        const token = getBearerToken(request);
        if (!token) {
            return new Response(JSON.stringify({ error: "Missing bearer token" }), { status: 401 });
        }

        const payload = await verifyToken(token);
        if (!payload) {
            return new Response(JSON.stringify({ error: "Invalid or expired token" }), { status: 401 });
        }

        return new Response(JSON.stringify({ user: payload }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export const authApi = new AuthApi(
    new RegisterController(),
    new LoginController()
);