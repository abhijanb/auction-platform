import type { Request, Response } from "express";
import multer from "multer";
import { json } from "../../../packages/shared/utils/http";
import { admin } from "../../../packages/shared/utils/auth";
import { logger } from "../../../packages/shared/utils/logger";

const UPLOAD_DIR = `${import.meta.dir}/../../../uploads`;

const ALLOWED_MIME: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
};

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadSingle = upload.single("file");

class UploadsApi {
    upload = admin(async (req, res) => {
        const file = req.file;
        if (!file) {
            return json(res, { error: "Missing file" }, 400);
        }

        const ext = ALLOWED_MIME[file.mimetype];
        if (!ext) {
            return json(res, { error: "Only PNG, JPEG, WEBP and GIF images are allowed" }, 400);
        }

        const name = `${crypto.randomUUID()}.${ext}`;
        await Bun.write(`${UPLOAD_DIR}/${name}`, file.buffer);

        logger.info({ name, size: file.size, type: file.mimetype }, "upload stored");

        return json(res, { url: `/uploads/${name}` }, 201);
    });
}

export const uploadsApi = new UploadsApi();

export async function serveUpload(req: Request, res: Response): Promise<void> {
    const file = Bun.file(`${UPLOAD_DIR}/${req.params.file ?? ""}`);
    if (!(await file.exists())) {
        json(res, { error: "Not found" }, 404);
        return;
    }
    const data = await file.arrayBuffer();
    res.set("Content-Type", file.type || "application/octet-stream");
    res.send(Buffer.from(data));
}