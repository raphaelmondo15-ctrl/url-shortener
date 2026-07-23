import pool from '../config/db.js';

export const healthCheck = async (req, res) => {
    try {
        await pool.query('SELECT 1');

        return res.status(200).json({ status: 'ok', database: 'connected' });

    } catch (error) {
        console.error('Database connection error:', error);
        return res.status(503).json({ status: 'error', database: 'disconnected' });
    }
};