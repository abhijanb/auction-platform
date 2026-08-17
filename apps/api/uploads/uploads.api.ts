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

class UploadsApi {
    upload = admin(async (request) => {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!(file instanceof File)) {
            return json({ error: "Missing file" }, 400);
        }

        const ext = ALLOWED_MIME[file.type];
        if (!ext) {
            return json({ error: "Only PNG, JPEG, WEBP and GIF images are allowed" }, 400);
        }
        if (file.size > 5 * 1024 * 1024) {
            return json({ error: "File too large (max 5MB)" }, 400);
        }

        const name = `${crypto.randomUUID()}.${ext}`;
        await Bun.write(`${UPLOAD_DIR}/${name}`, file);

        logger.info({ name, size: file.size, type: file.type }, "upload stored");

        return json({ url: `/uploads/${name}` }, 201);
    });
}

export const uploadsApi = new UploadsApi();

export async function serveUpload(params: Record<string, string>): Promise<Response> {
    const file = Bun.file(`${UPLOAD_DIR}/${params.file ?? ""}`);
    if (!(await file.exists())) return json({ error: "Not found" }, 404);
    return new Response(file);
}
