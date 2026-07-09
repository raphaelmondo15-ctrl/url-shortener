import express from 'express';
import  pool from './config/db.js';


const app = express();
app.use(express.json());

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
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});