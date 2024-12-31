"use client"

import { useState } from "react"
import { MainInterface } from "@/components/MainInterface"
import { Library } from "@/components/Library"
import { useAuth } from "@/contexts/AuthContext"

export function ClientHome() {
  const [currentPage, setCurrentPage] = useState<"studio" | "library">("studio")
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <main>
      {user ? (
        <>
          <nav className="bg-white border-b">
            <div className="container mx-auto px-4 py-2">
              <button
                className={`mr-4 ${currentPage === "studio" ? "font-bold" : ""}`}
                onClick={() => setCurrentPage("studio")}
              >
                Studio
              </button>
              <button
                className={currentPage === "library" ? "font-bold" : ""}
                onClick={() => setCurrentPage("library")}
              >
                Library
              </button>
            </div>
          </nav>
          {currentPage === "studio" ? <MainInterface /> : <Library />}
        </>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-4">Welcome to MelodyMind AI</h1>
          <p className="mb-4">Please log in to start creating music with AI.</p>
        </div>
      )}
    </main>
  )
}

