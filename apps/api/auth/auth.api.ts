import { parseBody } from "../../../packages/shared/utils/http";
import { registerSchema } from "../../../packages/shared/schemas/auth";
import { RegisterController } from "./controller/register.controller";

class AuthApi {
    constructor(public registerController: RegisterController) {}

    async register(request: Request): Promise<Response> {
        const parsed = await parseBody(request, registerSchema);
        if (!parsed.ok) return parsed.response;

        await this.registerController.register(parsed.body);
        return new Response("User registered successfully", { status: 201 });
    }
}

export const authApi = new AuthApi(new RegisterController());