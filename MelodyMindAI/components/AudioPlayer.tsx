"use client"

import { useEffect, useRef, useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipBack, SkipForward, Volume2, Download, Share2 } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

interface AudioPlayerProps {
  audioUrl: string
  trackId: string
}

export function AudioPlayer({ audioUrl, trackId }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.addEventListener('loadedmetadata', () => setDuration(audio.duration))
      audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime))
      audio.addEventListener('ended', () => setIsPlaying(false))
    }
    return () => {
      if (audio) {
        audio.removeEventListener('loadedmetadata', () => setDuration(audio.duration))
        audio.removeEventListener('timeupdate', () => setCurrentTime(audio.currentTime))
        audio.removeEventListener('ended', () => setIsPlaying(false))
      }
    }
  }, [audioUrl])

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = audioUrl
    link.download = `track_${trackId}.wav`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/track/${trackId}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast({
        title: "Link Copied",
        description: "Share link has been copied to clipboard!",
      })
    } catch (err) {
      console.error('Failed to copy: ', err)
      toast({
        title: "Error",
        description: "Failed to copy share link. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <motion.div 
      className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <audio ref={audioRef} src={audioUrl} />
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={togglePlayPause}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <Volume2 className="h-4 w-4" />
          <Slider
            className="w-24"
            defaultValue={[50]}
            max={100}
            step={1}
            onValueChangeonValueChange={(value) => {
              if (audioRef.current) {
                audioRef.current.volume = value[0] / 100;
              }
            }}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Slider
          value={[currentTime]}
          max={duration}
          step={0.1}
          onValueChange={([value]) => {
            if (audioRef.current) {
              audioRef.current.currentTime = value;
            }
          }}
        />
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </motion.div>
  )
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

