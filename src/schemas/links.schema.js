import {z} from 'zod';

export const linkSchema = z.object({
    target_url: z
    .url({ protocols: ['http', 'https'], message: 'Invalid URL format' }),

    code: z
    .string()
    .regex(/^[a-zA-Z0-9_-]{6}$/, { message: 'Code must be 6 characters long and can only contain letters, numbers, underscores, and hyphens' })
    .optional(),

    expires_at: z
    .iso()
    .datetime()
    .optional()
})