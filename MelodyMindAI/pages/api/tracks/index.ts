import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/utils/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const { data, error } = await supabase
          .from('tracks')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        res.status(200).json(data);
      } catch (error) {
        console.error('Error fetching tracks:', error);
        res.status(500).json({ error: 'Failed to fetch tracks' });
      }
      break;

    case 'POST':
      try {
        const { title, midi_url, audio_url, duration } = req.body;
        const { data, error } = await supabase
          .from('tracks')
          .insert({ title, midi_url, audio_url, duration })
          .single();
        
        if (error) throw error;
        res.status(201).json(data);
      } catch (error) {
        console.error('Error creating track:', error);
        res.status(500).json({ error: 'Failed to create track' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

