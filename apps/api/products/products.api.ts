import type { Request, Response } from "express";
import { parseBody, json } from "../../../packages/shared/utils/http";
import {
    createProductSchema,
    updateProductSchema,
} from "../../../packages/shared/schemas/product";
import { admin, user } from "../../../packages/shared/utils/auth";
import { ProductController } from "./controller/product.controller";

class ProductsApi {
    constructor(private productController: ProductController) {}

    create = admin(async (req, res) => {
        const parsed = await parseBody(req, createProductSchema);
        if (!parsed.ok) {
            json(res, { error: parsed.error }, 400);
            return;
        }
        json(res, await this.productController.create(parsed.body), 201);
    });

    list = admin(async (_req, res) => json(res, await this.productController.list()));

    getById = admin(async (req, res) => {
        const product = await this.productController.getById(this.idFrom(req));
        if (!product) return json(res, { error: "Product not found" }, 404);
        json(res, product);
    });

    publicList = user(async (_req, res) => json(res, await this.productController.list()));

    publicGetById = user(async (req, res) => {
        const product = await this.productController.getById(this.idFrom(req));
        if (!product) return json(res, { error: "Product not found" }, 404);
        json(res, product);
    });

    update = admin(async (req, res) => {
        const parsed = await parseBody(req, updateProductSchema);
        if (!parsed.ok) {
            json(res, { error: parsed.error }, 400);
            return;
        }
        const id = this.idFrom(req);
        const product = await this.productController.getById(id);
        if (!product) return json(res, { error: "Product not found" }, 404);
        if (this.locked(product)) {
            return json(res, { error: "Auction has started; product can no longer be changed" }, 409);
        }
        json(res, await this.productController.update(id, parsed.body));
    });

    delete = admin(async (req, res) => {
        const id = this.idFrom(req);
        const product = await this.productController.getById(id);
        if (!product) return json(res, { error: "Product not found" }, 404);
        if (this.locked(product)) {
            return json(res, { error: "Auction has started; product can no longer be changed" }, 409);
        }
        await this.productController.delete(id);
        json(res, { success: true });
    });

    private idFrom(req: Request): string {
        return req.params.id as string;
    }

    private locked(product: { auctionStartsAt: Date }): boolean {
        return new Date(product.auctionStartsAt).getTime() <= Date.now();
    }
}

export const productsApi = new ProductsApi(new ProductController());