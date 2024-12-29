'use server'

import { auth } from '@/auth'
import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function sendMessage({ content, receiverId }: { content: string; receiverId: string }) {
    const session = await auth()
    if (!session || !session.user.id) {
        return { error: 'Unauthorized' }
    }
    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id
        },
        include: {
            lawyer: true
        }
    })

    // Validate required fields
    if (!content || !receiverId || !user) {
        return { error: 'Missing required fields' }
    }

    // Optional validation for content length
    if (content.length > 1000) {
        return { error: 'Message content exceeds the maximum length of 1000 characters' }
    }


    try {
        // Create a new message record in the database
        const message = await prisma.message.create({
            data: {
                content,
                senderId: session.user.id,
                receiverId,
            },
        })

        // notification to reciever
        await prisma.notifications.create({
            data: {
                message: `${user.userName} sent you a message at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`,
                userId: receiverId,
                sentLawyerId: user.lawyer?.id
            }
        })

        // Revalidate the chat page to show the new message
        revalidatePath(`/chat/${receiverId}`) 
        return { message }
    } catch (error) {
        console.error('Error in sendMessage:', error)
        return { error: 'Failed to send message' }
    }
}
