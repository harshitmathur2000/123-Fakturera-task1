import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import { Pool } from 'pg';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, 'public')));


const port = process.env.PORT || 3000;

app.use(cors());

// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'pg_db',
//     password: '123456789',
//     port: 5000,
// });
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const seedDatabase = async () => {
  const sql = fs.readFileSync(path.join(__dirname, '/db/seed_data.sql')).toString();
  await pool.query(sql);
  console.log("Database seeded successfully");
};
seedDatabase();

pool.on('connect', async (client) => {
    try {
      await client.query("SET client_encoding = 'UTF8';");
    } catch (err) {
      console.error("Failed to set client_encoding:", err);
    }
  });
  

app.get('/api/nav-texts', async (req, res) => {
    const lang = req.query.lang || 'en'; // 'en' or 'sv'
    
    const texts = await pool.query('SELECT item_key, text_en, text_sv FROM nav_texts');
    
    const navTexts = {};
    texts.rows.forEach(row => {
      navTexts[row.item_key] = lang === 'sv' ? row.text_sv : row.text_en;
    });
    
    res.json(navTexts);
  });

app.get('/api/terms', async (req, res) => {
    try {
        const lang = req.query.lang || 'en';
        const result = await pool.query('SELECT key_name, english_text, swedish_text FROM page_texts');
        const response = {};
        result.rows.forEach(row => {
            response[row.key_name] = (lang === 'sv') ? row.swedish_text : row.english_text;
        });
        const result2 = await pool.query("SHOW client_encoding;");
        
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.get('/us', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'us.html'));
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});