import './globals.css'
import { Inter } from 'next/font/google'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { AuthProvider } from "@/contexts/AuthContext"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { Header } from "@/components/Header"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'MelodyMind AI',
  description: 'AI-powered music generation platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClientComponentClient()

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionContextProvider supabaseClient={supabase}>
          <AuthProvider>
            <ThemeProvider>
              <Header />
              {children}
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
        </SessionContextProvider>
      </body>
    </html>
  )
}

