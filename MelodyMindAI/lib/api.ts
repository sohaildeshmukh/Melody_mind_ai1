import { supabase } from './supabase'

export async function getTracks() {
  const { data, error } = await supabase
    .from('tracks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createTrack(track: { title: string; audio_url: string }) {
  const { data, error } = await supabase
    .from('tracks')
    .insert([track])
    .select()

  if (error) throw error
  return data[0]
}

export async function deleteTrack(id: number) {
  const { error } = await supabase
    .from('tracks')
    .delete()
    .eq('id', id)

  if (error) throw error
}

