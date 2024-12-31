"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { AudioPlayer } from "./AudioPlayer"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface Track {
  id: string;
  title: string;
  audio_url: string;
  created_at: string;
}

export function Library() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchTracks() {
      if (user) {
        try {
          const response = await fetch('/api/tracks')
          if (!response.ok) {
            throw new Error('Failed to fetch tracks')
          }
          const data = await response.json()
          setTracks(data)
        } catch (error) {
          console.error("Failed to fetch tracks:", error)
          toast({
            title: "Error",
            description: "Failed to fetch tracks. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchTracks()
  }, [user, toast])

  const handleDeleteTrack = async (trackId: string) => {
    try {
      const response = await fetch(`/api/tracks/${trackId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete track')
      }
      setTracks(tracks.filter(track => track.id !== trackId))
      toast({
        title: "Track deleted",
        description: "The track has been successfully deleted.",
      })
    } catch (error) {
      console.error("Failed to delete track:", error)
      toast({
        title: "Error",
        description: "Failed to delete track. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>Please log in to view your library.</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Music Library</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tracks.map((track) => (
          <div key={track.id} className="border p-4 rounded-lg">
            <h3 className="font-semibold">{track.title}</h3>
            <p>{new Date(track.created_at).toLocaleDateString()}</p>
            <AudioPlayer audioUrl={track.audio_url} trackId={track.id} />
            <Button 
              onClick={() => handleDeleteTrack(track.id)}
              className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

