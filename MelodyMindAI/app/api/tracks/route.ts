import { NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching tracks:', error);
    return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, midi_url, audio_url, duration } = await req.json();
    const { data, error } = await supabase
      .from('tracks')
      .insert({ title, midi_url, audio_url, duration })
      .single();
    
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating track:', error);
    return NextResponse.json({ error: 'Failed to create track' }, { status: 500 });
  }
}

