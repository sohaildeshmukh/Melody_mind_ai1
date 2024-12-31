import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface Preset {
  name: string
  genre: string
  mood: string
  tempo: number
}

interface MusicParametersPanelProps {
  preset: Preset | null
  onParametersChange: (parameters: any) => void
}

export function MusicParametersPanel({ preset, onParametersChange }: MusicParametersPanelProps) {
  const [isAdvancedMode, setIsAdvancedMode] = useState(false)
  const [parameters, setParameters] = useState({
    genre: "lofi",
    mood: "calm",
    tempo: 120,
    steps: 64,
    temperature: 1.0,
  })

  useEffect(() => {
    if (preset) {
      setParameters(prev => ({
        ...prev,
        genre: preset.genre,
        mood: preset.mood,
        tempo: preset.tempo,
      }))
    }
  }, [preset])

  useEffect(() => {
    onParametersChange(parameters)
  }, [parameters, onParametersChange])

  const handleParameterChange = (key: string, value: any) => {
    setParameters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">Music Parameters</h3>
      <div className="space-y-6">
        <div>
          <Label htmlFor="genre">Genre</Label>
          <Select value={parameters.genre} onValueChange={(value) => handleParameterChange("genre", value)}>
            <SelectTrigger id="genre">
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lofi">Lo-fi</SelectItem>
              <SelectItem value="classical">Classical</SelectItem>
              <SelectItem value="electronic">Electronic</SelectItem>
              <SelectItem value="jazz">Jazz</SelectItem>
              <SelectItem value="rock">Rock</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="mood">Mood</Label>
          <Select value={parameters.mood} onValueChange={(value) => handleParameterChange("mood", value)}>
            <SelectTrigger id="mood">
              <SelectValue placeholder="Select mood" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="happy">Happy</SelectItem>
              <SelectItem value="sad">Sad</SelectItem>
              <SelectItem value="energetic">Energetic</SelectItem>
              <SelectItem value="calm">Calm</SelectItem>
              <SelectItem value="mysterious">Mysterious</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="tempo">Tempo (BPM)</Label>
          <Slider
            id="tempo"
            min={60}
            max={180}
            step={1}
            value={[parameters.tempo]}
            onValueChange={([value]) => handleParameterChange("tempo", value)}
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>60</span>
            <span>180</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="advanced-mode"
            checked={isAdvancedMode}
            onCheckedChange={setIsAdvancedMode}
          />
          <Label htmlFor="advanced-mode">Advanced Mode</Label>
        </div>
        {isAdvancedMode && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="magenta-parameters">
              <AccordionTrigger>Magenta Parameters</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="steps">Steps</Label>
                    <Slider
                      id="steps"
                      min={16}
                      max={128}
                      step={16}
                      value={[parameters.steps]}
                      onValueChange={([value]) => handleParameterChange("steps", value)}
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>16</span>
                      <span>128</span>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="temperature">Temperature</Label>
                    <Slider
                      id="temperature"
                      min={0.1}
                      max={2.0}
                      step={0.1}
                      value={[parameters.temperature]}
                      onValueChange={([value]) => handleParameterChange("temperature", value)}
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>0.1</span>
                      <span>2.0</span>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </div>
  )
}

