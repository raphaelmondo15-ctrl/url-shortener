import pool from '../config/db.js';
import { generateShortCode } from './shortCode.service.js';

export async function createShortLink(target_url) {
    let shortCode = generateShortCode();
    const result = await pool.query(
        'SELECT id FROM links WHERE short_code = $1',
        [shortCode]
    );
    if (result.rows.length > 0) {
        return createShortLink(target_url);
    }
    const newLink = await pool.query(
        'INSERT INTO links (target_url, short_code) VALUES ($1, $2) RETURNING *',
        [target_url, shortCode]
    );
    return newLink.rows[0];
}