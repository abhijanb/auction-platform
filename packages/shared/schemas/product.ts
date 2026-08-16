import { z } from "zod";

export const createProductSchema = z.object({
    name: z.string().min(1).max(200),
    image: z.string().min(1),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductBody = z.infer<typeof createProductSchema>;
export type UpdateProductBody = z.infer<typeof updateProductSchema>;