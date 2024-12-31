"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MusicParametersPanel } from "./MusicParametersPanel"
import { QuickPresetsBar } from "./QuickPresetsBar"
import { AudioPlayer } from "./AudioPlayer"
import { useToast } from "@/components/ui/use-toast"
// import { initializeMagenta } from "@/utils/magenta"
import { useAuth } from "@/contexts/AuthContext"
import { motion } from "framer-motion"
import { useTheme } from "@/contexts/ThemeContext"

export function MainInterface() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generatedTrack, setGeneratedTrack] = useState(null)
  const { toast } = useToast()
  const [currentPreset, setCurrentPreset] = useState(null)
  const { user } = useAuth()
  const { theme } = useTheme()

  // useEffect(() => {
  //   initializeMagenta().catch(console.error)
  // }, [])

  const handleGenerate = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to generate music.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setProgress(0)
    setGeneratedTrack(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          steps: 64,
          temperature: 1.0,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate music');
      }

      const data = await response.json();
      setGeneratedTrack(data.track);

      toast({
        title: "Track created",
        description: `New track "${data.track.title}" has been generated.`,
      })
    } catch (error) {
      console.error("Failed to generate track:", error)
      toast({
        title: "Error",
        description: "Failed to generate track. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
      setProgress(100)
    }
  }

  const handlePresetSelect = (preset) => {
    setCurrentPreset(preset)
    toast({
      title: "Preset Applied",
      description: `Applied preset: ${preset.name}`,
    })
  }

  return (
    <motion.div 
      className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${theme === 'dark' ? 'text-white' : 'text-black'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="md:col-span-2">
        <motion.div 
          className={`rounded-lg shadow-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <h2 className="text-2xl font-bold mb-4">AI Music Generator</h2>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !user}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-lg mb-4"
          >
            {isGenerating ? "Generating..." : "Generate Music"}
          </Button>
          {isGenerating && (
            <Progress value={progress} className="w-full mb-4" />
          )}
          {generatedTrack && (
            <AudioPlayer audioUrl={generatedTrack.audio_url} trackId={generatedTrack.id} />
          )}
        </motion.div>
        <QuickPresetsBar onPresetSelect={handlePresetSelect} />
      </div>
      <div>
        <MusicParametersPanel preset={currentPreset} />
      </div>
    </motion.div>
  )
}

