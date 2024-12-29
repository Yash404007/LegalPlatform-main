import { GetUserById } from '@/actions/Data/User/GET'
import { auth } from '@/auth'
import prisma from '@/lib/db'
import { redirect } from 'next/navigation'
import ChatInterface from './_components/chatInterface'
import ConsultButton from './_components/ConsultButton'

type Props = {
    params: {
        id: string
    }
}

const ChatPage = async ({ params }: Props) => {
    const { id } = await params;

    const session = await auth();
    if(!session || !session.user.id){
        redirect("/")
    }

    const lawyer = await prisma.lawyer.findFirst({
        where: { 
            id
        },
        include: {
            user: true
        }
    })
    const reciepent = await GetUserById(lawyer?.userId)

    const sender = await GetUserById(session.user.id);
    const senderLawyer = await prisma.lawyer.findFirst({
        where: {
            userId: sender?.id
        }
    })

    const featuredLawyers = await prisma.lawyer.findMany({
      take: 5,
      include: {
        user: true
      }
    })

    if(!lawyer || !sender || !reciepent){
        redirect("/error?error=NotFound")
    }

    const initialMessages = await prisma.message.findMany({
        where: {
            OR: [
                { senderId: sender.id, receiverId: reciepent.id },
                { senderId: reciepent.id, receiverId: sender.id }
            ]
        },
        orderBy: { createdAt: 'asc' },
        take: 50 // Limit to last 50 messages for initial load
    });

    const existingConsultation = await prisma.consultation.findFirst({
        where: {
            lawyerId: lawyer.id,
            userId: sender.id
        }
    })

    return (
        <div className='pt-16'>
            <ConsultButton  
                lawyer={lawyer}
                client={sender}
                disabled={!!existingConsultation}
            />
            <ChatInterface 
                currentUser={sender}
                otherUser={reciepent}
                initialMessages={initialMessages}
                bothAreLawyers={!!senderLawyer}
                featuredLawyers={featuredLawyers}
                lawyer={lawyer}
            />
        </div>
    )
}

export default ChatPage