import { parseBody, json } from "../../../packages/shared/utils/http";
import {
    createProductSchema,
    updateProductSchema,
} from "../../../packages/shared/schemas/product";
import { admin } from "../../../packages/shared/utils/auth";
import { ProductController } from "./controller/product.controller";

type RouteRequest = Request & { params: Record<string, string> };

class ProductsApi {
    constructor(private productController: ProductController) {}

    create = admin(async (request) => {
        const parsed = await parseBody(request, createProductSchema);
        if (!parsed.ok) return parsed.response;
        return json(await this.productController.create(parsed.body), 201);
    });

    list = admin(async () => json(await this.productController.list()));

    getById = admin(async (request) => {
        const product = await this.productController.getById(this.idFrom(request));
        if (!product) return json({ error: "Product not found" }, 404);
        return json(product);
    });

    update = admin(async (request) => {
        const parsed = await parseBody(request, updateProductSchema);
        if (!parsed.ok) return parsed.response;
        return json(await this.productController.update(this.idFrom(request), parsed.body));
    });

    delete = admin(async (request) => {
        await this.productController.delete(this.idFrom(request));
        return json({ success: true });
    });

    private idFrom(request: Request): string {
        return (request as RouteRequest).params.id!;
    }
}

export const productsApi = new ProductsApi(new ProductController());