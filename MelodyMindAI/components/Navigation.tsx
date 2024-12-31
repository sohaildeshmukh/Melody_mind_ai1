'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export function Navigation() {
  const { user, signOut } = useAuth()

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">MelodyMind AI</Link>
        <div>
          <Link href="/" className="mr-4">Home</Link>
          {user ? (
            <>
              <Link href="/studio" className="mr-4">Studio</Link>
              <Link href="/library" className="mr-4">Library</Link>
              <button onClick={() => signOut()}>Sign Out</button>
            </>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  )
}

