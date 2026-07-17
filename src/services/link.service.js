import pool from '../config/db.js';
import { generateShortCode } from './shortCode.service.js';

export async function createShortLink(target_url, code, expires_at) {
    let shortCode;

    while (true) {
        shortCode = generateShortCode();

        const { rows } = await pool.query(
            'SELECT id FROM links WHERE short_url = $1',
            [shortCode]
        );

        if (rows.length === 0) {
            break;
        }
    }

    const { rows } = await pool.query(
        `INSERT INTO links (target_url, short_url)
         VALUES ($1, $2)
         RETURNING *`,
        [target_url, shortCode]
    );

    return rows[0];
}

// export async function getLinkByShortCode(short_code) {
//     const { rows } = await pool.query(
//         'SELECT * FROM links WHERE short_code = $1',
//         [short_code]
//     );
//     const link = rows[0];

//    if (!link) {
//      return null;
//    }

//    if (link.expires_at && new Date(link.expires_at) < new Date()) {
//         throw new Error('Link has expired');
//     }

//     return link;
// }

export async function processRedirect(shortCode, clickData) {
    const client = await pool.connection();

    try {
        await client.query('BEGIN');

        const { rows } = await client.query(
            'SELECT id, target_url, expires_at FROM links WHERE short_url = $1',
            [shortCode]
        );

        const link = rows[0];

        if (!link) {
            throw new Error('LINK_NOT_FOUND');
        }

        if (link.expires_at && new Date(link.expires_at) < new Date()) {
            throw new Error('LINK_EXPIRED');
        }

        await client.query(
            'INSERT INTO clicks (link_id, referrer, user_agent) VALUES ($1, $2, $3)',
            [link.id, clickData.referrer, clickData.userAgent]
        );

        await client.query('COMMIT');

        return link;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

export async function deleteLinkByShortCode(short_code) {
    const { rowCount, rows } = await pool.query(
        'DELETE FROM links WHERE short_url = $1 RETURNING *',
        [short_code]
    );
    if (rowCount === 0) {
        throw new Error('LINK_NOT_FOUND');
    }
    return rows[0];
}

export async function exportClicksToCSV(short_code) {
    const { rows } = await pool.query(
        'SELECT clicks.referrer, clicks.user_agent, clicks.created_at FROM clicks JOIN links ON clicks.link_id = links.id WHERE links.short_url = $1',
        [short_code]
    );
    return rows;
}
