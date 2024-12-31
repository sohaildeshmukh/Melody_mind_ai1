"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Music, Home, Library, User, LogOut, Menu, X, Sun, Moon } from 'lucide-react'
import { useAuth } from "@/contexts/AuthContext"
import { useTheme } from "@/contexts/ThemeContext"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

export function Header() {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/studio", icon: Music, label: "Studio" },
    { href: "/library", icon: Library, label: "Library" },
  ]

  if (user) {
    navItems.push({ href: "/profile", icon: User, label: "Profile" })
  }

  return (
    <motion.header 
      className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Music className="h-8 w-8 text-purple-700 dark:text-purple-400" />
            <span className="text-2xl font-bold text-purple-700 dark:text-purple-400">MelodyMind AI</span>
          </div>
          <nav className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={isActive(item.href) ? "default" : "ghost"}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-400 hidden md:inline">Credits: 50</span>
            {user ? (
              <>
                <Avatar>
                  <AvatarImage src={`https://avatar.vercel.sh/${user.email}`} alt={user.email} />
                  <AvatarFallback>{user.email.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="sm" onClick={() => signOut()} className="hidden md:flex">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              </>
            ) : (
              <Button variant="default" className="bg-purple-700 hover:bg-purple-800 hidden md:flex" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        {isMenuOpen && (
          <motion.nav 
            className="mt-4 space-y-2 md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={isActive(item.href) ? "default" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            ))}
            {user ? (
              <Button variant="ghost" className="w-full justify-start" onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            ) : (
              <Button variant="default" className="w-full justify-start bg-purple-700 hover:bg-purple-800" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            )}
          </motion.nav>
        )}
      </div>
    </motion.header>
  )
}

