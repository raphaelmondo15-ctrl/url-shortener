import pool from '../config/db.js';
import { generateShortCode } from './shortCode.service.js';

export async function createShortLink(target_url) {
    let shortCode;

    while (true) {
        shortCode = generateShortCode();

        const { rows } = await pool.query(
            'SELECT id FROM links WHERE short_code = $1',
            [shortCode]
        );

        if (rows.length === 0) {
            break;
        }
    }

    const { rows } = await pool.query(
        `INSERT INTO links (target_url, short_code)
         VALUES ($1, $2)
         RETURNING *`,
        [target_url, shortCode]
    );

    return rows[0];
}

export async function getLinkByShortCode(short_code) {
    const { rows } = await pool.query(
        'SELECT * FROM links WHERE short_code = $1',
        [short_code]
    );
    return rows[0] || null;
}