import pool from '../config/db.js';

export const createLink = async (req, res) => {
    try {
        const { target_url } = req.body;
        const { rows } = await pool.query('INSERT INTO links (target_url) VALUES ($1) RETURNING *', [target_url]);
        res.status(201).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getOriginalLink = async (req, res) => {
    try {
        const { short_url } = req.params;
        const { rows } = await pool.query('SELECT * FROM links WHERE short_url = $1', [short_url]);
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};