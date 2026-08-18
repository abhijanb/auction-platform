import { parseBody, json } from "../../../packages/shared/utils/http";
import {
    createProductSchema,
    updateProductSchema,
} from "../../../packages/shared/schemas/product";
import { admin, user } from "../../../packages/shared/utils/auth";
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

    publicList = user(async () => json(await this.productController.list()));

    publicGetById = user(async (request: Request) => {
        const product = await this.productController.getById(this.idFrom(request));
        if (!product) return json({ error: "Product not found" }, 404);
        return json(product);
    });

    update = admin(async (request) => {
        const parsed = await parseBody(request, updateProductSchema);
        if (!parsed.ok) return parsed.response;
        const id = this.idFrom(request);
        const product = await this.productController.getById(id);
        if (!product) return json({ error: "Product not found" }, 404);
        const lock = this.lockResponse(product);
        if (lock) return lock;
        return json(await this.productController.update(id, parsed.body));
    });

    delete = admin(async (request) => {
        const id = this.idFrom(request);
        const product = await this.productController.getById(id);
        if (!product) return json({ error: "Product not found" }, 404);
        const lock = this.lockResponse(product);
        if (lock) return lock;
        await this.productController.delete(id);
        return json({ success: true });
    });

    private idFrom(request: Request): string {
        return (request as RouteRequest).params.id!;
    }

    private lockResponse(product: { auctionStartsAt: Date }): Response | null {
        const started = new Date(product.auctionStartsAt).getTime() <= Date.now();
        if (started) {
            return json({ error: "Auction has started; product can no longer be changed" }, 409);
        }
        return null;
    }
}

export const productsApi = new ProductsApi(new ProductController());