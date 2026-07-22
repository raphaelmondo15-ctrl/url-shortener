import { linkSchema } from '../schemas/links.schema.js';

export function validateLink(req, res, next) {
    const parsed = linkSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            error: parsed.error.issues[0].message
        });
        }

        req.validatedData = parsed.data;
        next();
}