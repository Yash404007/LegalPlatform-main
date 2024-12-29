'use client'

import { Session } from "next-auth"
import { UserPreferences } from "@/types/user"
import { UserProvider } from "@/providers/user-provider"

interface ProvidersProps {
  children: React.ReactNode
  session: Session | null
  preferences: UserPreferences | null
}

export function Providers({ children, session, preferences }: ProvidersProps) {
  return (
    <UserProvider 
      initialUser={session?.user ?? null} 
      initialPreferences={preferences}
    >
      {children}
    </UserProvider>
  )
}

