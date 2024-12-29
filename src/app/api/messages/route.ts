// import { NextResponse } from 'next/server'
// import prisma from '@/lib/db'
// import { auth } from '@/auth'

// export async function POST(req: Request) {
//     try {
//         const session = await auth()
//         if (!session || !session.user.id) {
//             return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//         }

//         const { content, senderId, receiverId } = await req.json()

//         if (senderId !== session.user.id) {
//             return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//         }

//         const message = await prisma.message.create({
//             data: {
//                 content,
//                 senderId,
//                 receiverId
//             }
//         })

//         return NextResponse.json(message)
//     } catch (error) {
//         console.error('Error in POST /api/messages:', error)
//         return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
//     }
// }



import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { auth } from '@/auth'

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(req.url)
    const senderId = url.searchParams.get('senderId')
    const receiverId = url.searchParams.get('receiverId')

    if (!senderId || !receiverId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error in GET /api/messages:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// Remove the POST method as it's now handled by WebSockets

