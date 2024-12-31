'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createTrack } from '@/lib/api'
import { Navigation } from '@/components/Navigation'
import { useRouter } from 'next/navigation'

export default function Studio() {
  const [isGenerating, setIsGenerating] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  const generateTrack = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    setIsGenerating(true)
    try {
      // Simulating AI music generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      const track = await createTrack({
        title: `AI Generated Track ${new Date().toISOString()}`,
        audio_url: 'https://example.com/sample-audio.mp3' // Replace with actual generated audio URL
      })
      console.log('Track created:', track)
      router.push('/library')
    } catch (error) {
      console.error('Failed to generate track:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div>
      <Navigation />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold mb-4">Music Studio</h1>
        <button
          onClick={generateTrack}
          disabled={isGenerating}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {isGenerating ? 'Generating...' : 'Generate New Track'}
        </button>
      </main>
    </div>
  )
}

