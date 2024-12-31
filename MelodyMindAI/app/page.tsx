import { MusicScene } from '@/components/MusicScene'
import { MainInterface } from '@/components/MainInterface'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <MusicScene />
      <div className="container mx-auto px-4 py-8">
        <MainInterface />
      </div>
    </div>
  )
}

