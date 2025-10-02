"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AdminContextType {
  isAdmin: boolean
  isEditMode: boolean
  login: (password: string) => boolean
  logout: () => void
  toggleEditMode: () => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

const ADMIN_PASSWORD = "@123admin" // In production, this should be environment variable

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin")
    if (adminStatus === "true") {
      setIsAdmin(true)
    }
  }, [])

  const login = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true)
      localStorage.setItem("isAdmin", "true")
      return true
    }
    return false
  }

  const logout = () => {
    setIsAdmin(false)
    setIsEditMode(false)
    localStorage.removeItem("isAdmin")
  }

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode)
  }

  return (
    <AdminContext.Provider value={{ isAdmin, isEditMode, login, logout, toggleEditMode }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
