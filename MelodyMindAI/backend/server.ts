import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Supabase client setup
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/tracks', async (req, res) => {
  const { data, error } = await supabase
    .from('tracks')
    .select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

app.post('/api/tracks', async (req, res) => {
  const { title, genre, duration } = req.body;
  const { data, error } = await supabase
    .from('tracks')
    .insert([{ title, genre, duration }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(201).json(data);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

