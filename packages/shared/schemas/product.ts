import { z } from "zod";

const baseProductSchema = z.object({
    name: z.string().min(1).max(200),
    image: z.string().min(1),
    startingPrice: z.number().min(0),
    auctionStartsAt: z.string().datetime(),
    auctionEndsAt: z.string().datetime(),
});

const validateAuctionTimes = (data: {
    auctionStartsAt?: string;
    auctionEndsAt?: string;
}, ctx: z.RefinementCtx): void => {
    if (data.auctionStartsAt) {
        const start = new Date(data.auctionStartsAt).getTime();
        if (start <= Date.now()) {
            ctx.addIssue({
                code: "custom",
                message: "auctionStartsAt must be in the future",
                path: ["auctionStartsAt"],
            });
        }
    }
    if (data.auctionStartsAt && data.auctionEndsAt) {
        const start = new Date(data.auctionStartsAt).getTime();
        const end = new Date(data.auctionEndsAt).getTime();
        if (end <= start) {
            ctx.addIssue({
                code: "custom",
                message: "auctionEndsAt must be after auctionStartsAt",
                path: ["auctionEndsAt"],
            });
        }
    }
};

export const createProductSchema = baseProductSchema.superRefine(validateAuctionTimes);

export const updateProductSchema = baseProductSchema.partial().superRefine(validateAuctionTimes);

export type CreateProductBody = z.infer<typeof createProductSchema>;
export type UpdateProductBody = z.infer<typeof updateProductSchema>;