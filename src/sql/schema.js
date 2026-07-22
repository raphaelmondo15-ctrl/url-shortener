
import pool from '../config/db.js';
export async function createTables() {
    try {
      await pool.query  (`   CREATE TABLE If NOT EXISTS links (
    id SERIAL PRIMARY KEY,
    code VARCHAR(16) NOT NULL UNIQUE,
    target_url TEXT NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    click_count INTEGER NOT NULL DEFAULT 0 CHECK (click_count >= 0)
);`);

 await pool.query(`CREATE TABLE If NOT EXISTS clicks (
    id SERIAL PRIMARY KEY,
    link_id INTEGER NOT NULL REFERENCES links(id) ON DELETE CASCADE,
    clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    referrer TEXT,
    user_agent TEXT);`
);
console.log('Tables created successfully');
    }catch (error) {
        console.error('Error creating tables:', error);
    }
   

}


// CREATE INDEX idx_clicks_link_id ON clicks(link_id);

// UPDATE links SET click_count = click_count + 1 WHERE  short_url = 'your_short_url'; -- Replace 'your_short_url' with the actual short URL you want to update

