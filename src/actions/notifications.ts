'use server'

import  prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getNotifications(userId: string) {
  const notifications = await prisma.notifications.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5, // Limit to 5 most recent notifications
    include: {
      user: {
        include: {
          lawyer: true
        }
      }
    }
  })
  return notifications
}

export async function markAllAsRead(userId: string) {
  await prisma.notifications.updateMany({
    where: { userId, read: false },
    data: { read: true },
  })
  revalidatePath('/') // Revalidate the page to reflect the changes
}

export async function markAsRead(notificationId: string) {
  await prisma.notifications.update({
    where: { id: notificationId },
    data: { read: true },
  })
  revalidatePath('/') // Revalidate the page to reflect the changes
}

