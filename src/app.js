import express from 'express';
import  pool from './config/db.js';
import { createTables } from './sql/schema.js';
import router from './routes/link.routes.js';
import { healthCheck } from './controllers/health.controller.js';

const app = express();
app.use(express.json());
createTables();
app.use('/links', router);
app.use('/health', healthCheck);

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


app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
});




export default app;