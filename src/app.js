import express from 'express';
import  pool from './config/db.js';
import { createTables } from './sql/schema.js';
import router from './routes/link.routes.js';

const app = express();
app.use(express.json());
createTables();
app.use('/links', router);

app.get('/', (req, res) => {
    res.send('Welcome to the URL Shortener API');
});

app.get('/test-db', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT NOW()');
        res.json({ message: 'Database connection successful', timestamp: rows[0].now });
    } catch (error) {
        res.status(500).json({ error: 'Database connection failed', details: error.message });
    }
});


export default app;