import { createLinkSchema } from '../schemas/link.schema.js';

export function validateLink(req, res, next) {
    const result = createLinkSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            error: result.error.issues[0].message
        });
        }

        req.validatedData = result.data;
        next();
}