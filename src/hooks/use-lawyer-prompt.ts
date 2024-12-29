'use client'

import { useEffect, useState } from 'react'

interface UseLawyerPromptProps {
  userId: string
  showRegisterAsLawyer: boolean
  nextPromptDate: Date | null
  neverShowPrompt: boolean
}

export function useLawyerPrompt({
  userId,
  showRegisterAsLawyer,
  nextPromptDate,
  neverShowPrompt
}: UseLawyerPromptProps) {
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    if (!userId || neverShowPrompt || !showRegisterAsLawyer) {
      return
    }

    if (nextPromptDate) {
      const now = new Date()
      if (new Date(nextPromptDate) > now) {
        return
      }
    }

    setShowPrompt(true)
  }, [userId, showRegisterAsLawyer, nextPromptDate, neverShowPrompt])

  return {
    showPrompt,
    setShowPrompt
  }
}

