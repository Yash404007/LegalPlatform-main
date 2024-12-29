'use client'

import { createContext, useContext, useState } from "react"
import { Session } from "next-auth"
import { UserContextType, UserPreferences } from "@/types/user"

const UserContext = createContext<UserContextType | undefined>(undefined)

export interface UserProviderProps {
  children: React.ReactNode
  initialUser: Session["user"] | null
  initialPreferences: UserPreferences | null
}

interface UpdatePreferencesInput {
  showRegisterAsLawyer?: boolean
  nextPromptDate?: Date | null
  neverShowPrompt?: boolean
}

export function UserProvider({
  children,
  initialUser,
  initialPreferences,
}: UserProviderProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [user, setUser] = useState<Session["user"] | null>(initialUser)
  const [preferences, setPreferences] = useState<UserPreferences | null>(initialPreferences)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const updatePreferences = async (input: UpdatePreferencesInput) => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/preferences', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        throw new Error('Failed to update preferences')
      }

      const updatedPreferences = await response.json()
      setPreferences(updatedPreferences)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Something went wrong'))
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    user,
    preferences,
    isLoading,
    error,
    updatePreferences,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

