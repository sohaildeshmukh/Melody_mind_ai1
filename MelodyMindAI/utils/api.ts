import { supabase } from './supabase'

export async function getTracks() {
  const { data, error } = await supabase
    .from('tracks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('Failed to fetch tracks')
  }

  return data
}

export async function createTrack(track: { title: string; genre: string; duration: string }) {
  const { data, error } = await supabase
    .from('tracks')
    .insert([track])
    .select()

  if (error) {
    throw new Error('Failed to create track')
  }

  return data[0]
}

export async function deleteTrack(id: number) {
  const { error } = await supabase
    .from('tracks')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error('Failed to delete track')
  }
}

