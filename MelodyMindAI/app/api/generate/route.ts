import { NextResponse } from 'next/server'
import { generateMelody, convertToMIDI, convertToAudio } from '@/utils/magenta'
import { supabase } from '@/utils/supabase'

export async function POST(req: Request) {
  try {
    const { steps, temperature } = await req.json();
    
    // Generate melody
    const melody = await generateMelody(steps, temperature);
    
    // Convert to MIDI
    const midiData = convertToMIDI(melody);
    
    // Convert to audio
    const audioBuffer = await convertToAudio(melody);
    
    // Save MIDI and audio data to Supabase storage
    const midiFileName = `melody_${Date.now()}.mid`;
    const audioFileName = `melody_${Date.now()}.wav`;
    
    const { data: midiUpload, error: midiError } = await supabase.storage
      .from('melodies')
      .upload(midiFileName, midiData);
    
    if (midiError) throw midiError;
    
    const { data: audioUpload, error: audioError } = await supabase.storage
      .from('melodies')
      .upload(audioFileName, audioBuffer);
    
    if (audioError) throw audioError;
    
    // Create track record in database
    const { data: track, error: trackError } = await supabase
      .from('tracks')
      .insert({
        title: `Generated Melody ${Date.now()}`,
        midi_url: midiUpload.path,
        audio_url: audioUpload.path,
        duration: melody.totalTime
      })
      .single();
    
    if (trackError) throw trackError;
    
    return NextResponse.json({ track });
  } catch (error) {
    console.error('Error generating music:', error);
    return NextResponse.json({ error: 'Failed to generate music' }, { status: 500 });
  }
}

