import { Session } from "next-auth"

export interface UserPreferences {
  id: string
  showRegisterAsLawyer: boolean
  nextPromptDate: Date | null
  neverShowPrompt: boolean
  userId: string
}

export interface UserContextType {
  user: Session["user"] | null
  preferences: UserPreferences | null
  isLoading: boolean
  error: Error | null
}

