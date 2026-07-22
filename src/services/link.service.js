// import pool from '../config/db.js';
// import { generateShortCode } from './shortCode.service.js';
// import { buildPaginationQuery } from '../utils/pagination.js';

// export async function createLink({
//     target_url,
//     code,
//     expires_at
// }) {

//     let shortCode = code;

//     // User didn't provide a code
//     if (!shortCode) {

//         while (true) {

//             shortCode = generateShortCode();

//             const { rows } = await pool.query(
//                 'SELECT id FROM links WHERE code = $1',
//                 [shortCode]
//             );

//             if (rows.length === 0) {
//                 break;
//             }
//         }

//     } else {

//         // Vanity code supplied
//         const { rows } = await pool.query(
//             'SELECT id FROM links WHERE code = $1',
//             [shortCode]
//         );

//         if (rows.length > 0) {
//             throw new Error('CODE_ALREADY_EXISTS');
//         }
//     }

//     const { rows } = await pool.query(
//         `INSERT INTO links
//         (
//             code,
//             target_url,
//             expires_at
//         )
//         VALUES ($1, $2, $3)
//         RETURNING *`,
//         [
//             shortCode,
//             target_url,
//             expires_at ?? null
//         ]
//     );

//     return rows[0];
// }

// export async function processRedirect(code, clickData) {
// const client = await pool.connect();
    
// try {
//     await client.query('BEGIN'); 
//     const { rows } = await client.query(
//         'SELECT id, target_url, expires_at FROM links WHERE code = $1',
//         [code]
//     );

//     if (rows.length === 0) {
//         throw new Error('LINK_NOT_FOUND');
//     }

//     const link = rows[0];

//      if (
//             link.expires_at &&
//             new Date(link.expires_at) < new Date()
//         ) {
//             throw new Error('LINK_EXPIRED');
//         }

//     await client.query(
//         'UPDATE links SET click_count = click_count + 1 WHERE id = $1',
//         [link.id]
//     );

//     await client.query(
//         `INSERT INTO clicks
//         (
//             link_id,
//             user_agent,
//             referrer
//         )
//         VALUES ($1, $2, $3,)`,
//         [
//             link.id,
//             clickData.user_agent,
//             clickData.referrer
//         ]
//     );

//     await client.query('COMMIT');

//     return link;
// } catch (error) {
//     await client.query('ROLLBACK');
//     throw error;
// } finally {
//     client.release();
// }
// }

// export async function getClickLogForExport(code) {
//     const { rows } = await pool.query(
//         `
//         SELECT
//             c.clicked_at,
//             c.referrer,
//             c.user_agent
//         FROM clicks c
//         JOIN links l
//             ON c.link_id = l.id
//         WHERE l.code = $1
//         ORDER BY c.clicked_at DESC
//         `,
//         [code]
//     );

//     return rows;
// }


// export async function getLinkMetadata(code) {
//     const { rows } = await pool.query(
//         'SELECT id, code, target_url, created_at, expires_at, click_count FROM links WHERE code = $1',
//         [code]
//     );

//     if (rows.length === 0) {
//         throw new Error('LINK_NOT_FOUND');
//     }

//     return rows[0];
// }



// export async function getClicksLog(code, after, limit) {
//     const values = [code];
//     let query = `
//         SELECT c.id, c.user_agent, c.referrer, c.created_at
//         FROM clicks c
//         JOIN links l ON c.link_id = l.id
//         WHERE l.code = $1
//     `;

//     if (after) {
//         values.push(after);
//         query += ` AND c.created_at > $${values.length}`;
//     }

//     query += ' ORDER BY c.created_at DESC';

//     if (limit) {
//         values.push(limit);
//         query += ` LIMIT $${values.length}`;
//     }

//     const { rows } = await pool.query(query, values);

//     return buildPaginationQuery(rows, 'created_at');
// }

import pool from '../config/db.js';
import { generateShortCode } from './shortCode.service.js';
import { getPagination } from '../utils/pagination.js';

export async function createLink({
    target_url,
    code,
    expires_at
}) {

    let shortCode = code;

    // User didn't provide a vanity code
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

        // User supplied a vanity code
        const { rows } = await pool.query(
            'SELECT id FROM links WHERE code = $1',
            [shortCode]
        );

        if (rows.length > 0) {
            throw new Error('CODE_ALREADY_EXISTS');
        }
    }

    const { rows } = await pool.query(
        `
        INSERT INTO links
        (
            code,
            target_url,
            expires_at
        )
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [
            shortCode,
            target_url,
            expires_at ?? null
        ]
    );

    return rows[0];
}

export async function processRedirect(code, clickData) {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const { rows } = await client.query(
            `
            SELECT
                id,
                target_url,
                expires_at
            FROM links
            WHERE code = $1
            `,
            [code]
        );

        if (rows.length === 0) {
            throw new Error('LINK_NOT_FOUND');
        }

        const link = rows[0];

        if (
            link.expires_at &&
            new Date(link.expires_at) < new Date()
        ) {
            throw new Error('LINK_EXPIRED');
        }

        // Atomic click counter
        await client.query(
            `
            UPDATE links
            SET click_count = click_count + 1
            WHERE id = $1
            `,
            [link.id]
        );

        // Record click
        await client.query(
            `
            INSERT INTO clicks
            (
                link_id,
                user_agent,
                referrer
            )
            VALUES ($1, $2, $3)
            `,
            [
                link.id,
                clickData.userAgent,
                clickData.referrer
            ]
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

export async function getLinkMetadata(code) {

    const { rows } = await pool.query(
        `
        SELECT
            id,
            code,
            target_url,
            created_at,
            expires_at,
            click_count
        FROM links
        WHERE code = $1
        `,
        [code]
    );

    if (rows.length === 0) {
        throw new Error('LINK_NOT_FOUND');
    }

    return rows[0];
}

export async function getClickLog(code, after, limit) {

    const values = [code];

    let query = `
        SELECT
            c.id,
            c.clicked_at,
            c.referrer,
            c.user_agent
        FROM clicks c
        JOIN links l
            ON c.link_id = l.id
        WHERE l.code = $1
    `;

    if (after) {
        values.push(after);

        query += `
            AND c.clicked_at < $${values.length}
        `;
    }

    query += `
        ORDER BY c.clicked_at DESC
    `;

    if (limit) {
        values.push(limit);

        query += `
            LIMIT $${values.length}
        `;
    }

    const { rows } = await pool.query(query, values);

    return buildPaginationQuery(rows, 'clicked_at');
}

export async function getClickLogForExport(code) {

    const { rows } = await pool.query(
        `
        SELECT
            c.clicked_at,
            c.referrer,
            c.user_agent
        FROM clicks c
        JOIN links l
            ON c.link_id = l.id
        WHERE l.code = $1
        ORDER BY c.clicked_at DESC
        `,
        [code]
    );

    if (rows.length === 0) {
        throw new Error('LINK_NOT_FOUND');
    }

    return rows;
}

export async function deleteLinkByCode(code) {

    const { rowCount } = await pool.query(
        `
        DELETE FROM links
        WHERE code = $1
        `,
        [code]
    );

    if (rowCount === 0) {
        throw new Error('LINK_NOT_FOUND');
    }
}