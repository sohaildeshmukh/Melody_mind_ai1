import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

const presets = [
  { name: "Chill Lo-fi", genre: "Lo-fi", mood: "Calm", tempo: 80 },
  { name: "Upbeat Pop", genre: "Pop", mood: "Happy", tempo: 120 },
  { name: "Ambient Relaxation", genre: "Ambient", mood: "Calm", tempo: 60 },
  { name: "Epic Orchestral", genre: "Classical", mood: "Energetic", tempo: 110 },
  { name: "Jazz Fusion", genre: "Jazz", mood: "Mysterious", tempo: 100 },
  { name: "Electronic Dance", genre: "Electronic", mood: "Energetic", tempo: 128 },
  { name: "Acoustic Folk", genre: "Folk", mood: "Calm", tempo: 90 },
  { name: "Cinematic Score", genre: "Cinematic", mood: "Mysterious", tempo: 85 },
]

export function QuickPresetsBar({ onPresetSelect }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mt-8">
      <h3 className="text-xl font-bold mb-4">Quick Presets</h3>
      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <div className="flex w-max space-x-4 p-4">
          {presets.map((preset) => (
            <Button
              key={preset.name}
              variant="outline"
              className="flex-shrink-0"
              onClick={() => onPresetSelect(preset)}
            >
              {preset.name}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}

