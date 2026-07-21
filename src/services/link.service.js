import pool from '../config/db.js';
import { generateShortCode } from './shortCode.service.js';

export async function createLink({
    target_url,
    code,
    expires_at
}) {

    let shortCode = code;

    // User didn't provide a code
    if (!shortCode) {

        while (true) {

            shortCode = generateShortCode();

            const { rows } = await pool.query(
                'SELECT id FROM links WHERE code = $1',
                [shortCode]
            );

            if (rows.length === 0) {
                break;
            }
        }

    } else {

        // Vanity code supplied
        const { rows } = await pool.query(
            'SELECT id FROM links WHERE code = $1',
            [shortCode]
        );

        if (rows.length > 0) {
            throw new Error('CODE_ALREADY_EXISTS');
        }
    }

    const { rows } = await pool.query(
        `INSERT INTO links
        (
            code,
            target_url,
            expires_at
        )
        VALUES ($1, $2, $3)
        RETURNING *`,
        [
            shortCode,
            target_url,
            expires_at ?? null
        ]
    );

    return rows[0];
}