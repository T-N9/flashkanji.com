'use client'

import { deleteWaniKaniToken, sendWaniKaniToken } from '@/api/usersRoute'
import { useUserStore } from '@/store/userState'
import { Button, Input } from '@heroui/react'
import React, { useState } from 'react'
import { toast } from 'sonner'


const SubmitWaniTokenForm = () => {
  const { waniExists, userId, setWaniExists } = useUserStore()
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)

  if (!userId) return <p>Please log in to connect WaniKani.</p>

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await sendWaniKaniToken(userId, token)
      if (res.success) {
        setWaniExists(true)
        toast.success('WaniKani token connected successfully!')
      } else {
        toast.error('Failed to connect token. Please try again.')
      }
    } catch (err) {
      toast.error('Error connecting token. Check console.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to remove your WaniKani token?')) return
    setLoading(true)
    try {
      const res = await deleteWaniKaniToken(userId)
      if (res.success) {
        setWaniExists(false)
        setToken('')
        toast.success('WaniKani token removed.')
      } else {
        toast.error('Failed to remove token.')
      }
    } catch (err) {
      toast.error('Error removing token. Check console.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {waniExists ? (
        <div className="flex justify-between items-center gap-2">
          <p className="text-green-600 font-medium">WaniKani Connected.</p>
          <Button size='sm' color="danger" onClick={handleDelete} disabled={loading}>
            {loading ? 'Processing...' : 'Remove Token'}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Input
            placeholder="Enter WaniKani API token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !token}>
            {loading ? 'Submitting...' : 'Connect WaniKani'}
          </Button>
        </form>
      )}
    </div>
  )
}

export default SubmitWaniTokenForm
