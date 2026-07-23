import pool from "../src/config/db.js";

export async function cleanDb() {
    await pool.query( `   TRUNCATE TABLE clicks, links 
        RESTART IDENTITY CASCADE
    `);
}

export async function closeDb() {
    await pool.end();
}