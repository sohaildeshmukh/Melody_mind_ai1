'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getTracks, deleteTrack } from '@/lib/api'
import { Navigation } from '@/components/Navigation'
import { useRouter } from 'next/navigation'

interface Track {
  id: number
  title: string
  audio_url: string
  created_at: string
}

export default function Library() {
  const [tracks, setTracks] = useState<Track[]>([])
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      fetchTracks()
    } else {
      router.push('/login')
    }
  }, [user, router])

  const fetchTracks = async () => {
    try {
      const fetchedTracks = await getTracks()
      setTracks(fetchedTracks)
    } catch (error) {
      console.error('Failed to fetch tracks:', error)
    }
  }

  const handleDeleteTrack = async (id: number) => {
    try {
      await deleteTrack(id)
      setTracks(tracks.filter(track => track.id !== id))
    } catch (error) {
      console.error('Failed to delete track:', error)
    }
  }

  return (
    <div>
      <Navigation />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold mb-4">Your Music Library</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tracks.map(track => (
            <div key={track.id} className="border p-4 rounded">
              <h2 className="text-xl font-semibold">{track.title}</h2>
              <p>Created: {new Date(track.created_at).toLocaleDateString()}</p>
              <audio controls src={track.audio_url} className="mt-2 w-full" />
              <button
                onClick={() => handleDeleteTrack(track.id)}
                className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

