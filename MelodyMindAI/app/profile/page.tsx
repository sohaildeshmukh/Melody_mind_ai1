"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/utils/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'

export default function ProfilePage() {
  const { user } = useAuth()
  const [username, setUsername] = useState('')
  const [website, setWebsite] = useState('')
  const [avatar_url, setAvatarUrl] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('username, website, avatar_url')
        .eq('id', user.id)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching user profile:', error)
          } else if (data) {
            setUsername(data.username || '')
            setWebsite(data.website || '')
            setAvatarUrl(data.avatar_url || '')
          }
        })
    }
  }, [user])

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const updates = {
      id: user.id,
      username,
      website,
      avatar_url,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('profiles').upsert(updates)

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Success',
        description: 'Profile updated successfully!',
      })
    }
  }

  if (!user) {
    return <div>Please log in to view your profile.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <form onSubmit={updateProfile} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="text" value={user.email} disabled />
        </div>
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
        <Button type="submit">Update Profile</Button>
      </form>
    </div>
  )
}

