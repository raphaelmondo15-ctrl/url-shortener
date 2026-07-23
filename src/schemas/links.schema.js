// import {z} from 'zod';

// export const linkSchema = z.object({
//     target_url: z
//     .url({ protocols: ['http', 'https'], message: 'Invalid URL format' }),

//     code: z
//     .string()
//     .regex(/^[a-zA-Z0-9_-]{6}$/, { message: 'Code must be 6 characters long and can only contain letters, numbers, underscores, and hyphens' })
//     .optional(),

//     expires_at: z
//     .string()
//     .datetime()
//     .optional()
// })

import { z } from 'zod';

export const linkSchema = z.object({
    target_url: z
        .url({
            message: 'Invalid URL format'
        })
        .refine(
            (url) =>
                url.startsWith('http://') ||
                url.startsWith('https://'),
            {
                message: 'URL must use http or https'
            }
        ),

    code: z
        .string()
        .regex(
            /^[A-Za-z0-9_-]{3,16}$/,
            {
                message:
                    'Code must be between 3 and 16 characters and contain only letters, numbers, "_" or "-"'
            }
        )
        .optional(),

    expires_at: z
        .string()
        .datetime()
        .optional()
});