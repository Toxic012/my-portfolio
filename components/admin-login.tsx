"use client"

import type React from "react"

import { useState } from "react"
import { Lock, LogOut, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAdmin } from "@/lib/admin-context"

export function AdminLogin() {
  const [password, setPassword] = useState("")
  const [showLogin, setShowLogin] = useState(false)
  const { isAdmin, isEditMode, login, logout, toggleEditMode } = useAdmin()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const success = login(password)
    if (success) {
      setPassword("")
      setShowLogin(false)
    } else {
      alert("Invalid password")
    }
  }

  if (isAdmin) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex gap-2">
        <Button variant={isEditMode ? "default" : "outline"} size="icon" onClick={toggleEditMode} className="shadow-lg">
          <Edit className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={logout} className="shadow-lg bg-transparent">
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {showLogin ? (
        <form onSubmit={handleLogin} className="bg-card border border-border rounded-lg p-4 shadow-lg">
          <Input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-2"
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm">
              Login
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowLogin(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button variant="outline" size="icon" onClick={() => setShowLogin(true)} className="shadow-lg">
          <Lock className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}
