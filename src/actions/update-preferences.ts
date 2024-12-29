'use server'

import { auth } from '@/auth'
import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

type UpdatePreferencesInput = {
  userId: string
  showRegisterAsLawyer?: boolean
  nextPromptDate?: Date | null
  neverShowPrompt?: boolean
}

export async function updatePreferences({
  userId,
  showRegisterAsLawyer,
  nextPromptDate,
  neverShowPrompt
}: UpdatePreferencesInput) {
  try {
    const session = await auth();
    if(!session) return { success: false, error: 'Failed to update preferences' };
    // First try to find existing preferences
    const existing = await prisma.preferences.findUnique({
      where: { userId }
    })

    if (existing) {
      // Update existing preferences
      await prisma.preferences.update({
        where: { userId },
        data: {
          showRegisterAsLawyer: showRegisterAsLawyer ?? existing.showRegisterAsLawyer,
          nextPromptDate: nextPromptDate ?? existing.nextPromptDate,
          neverShowPrompt: neverShowPrompt ?? existing.neverShowPrompt
        }
      })
    } else {
      // Create new preferences
      await prisma.preferences.create({
        data: {
          userId,
          showRegisterAsLawyer: showRegisterAsLawyer ?? true,
          nextPromptDate,
          neverShowPrompt: neverShowPrompt ?? false
        }
      })
    }

    revalidatePath('/')
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to update preferences' }
  }
}

