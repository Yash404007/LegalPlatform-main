import { auth } from '@/auth'
import LawyerRegistrationForm from './_components/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GavelIcon } from 'lucide-react'
import AuthMessage from '@/components/Global/AuthMessage';
import prisma from '@/lib/db';
import LawyerAlreadyRegisteredLayout from './_components/lawyerAlreadyRegisteredMessage';
import Image from 'next/image';

export default async function LawyerRegistrationPage() {
  const session = await auth();

  if (!session || !session.user.id) {
    return <AuthMessage />
  }

  const lawyer = await prisma.lawyer.findMany({
    where: {
        userId: session.user.id
    }
  })
  if(lawyer.length > 0) return <LawyerAlreadyRegisteredLayout>
    <p>Lawyer already registered</p>
  </LawyerAlreadyRegisteredLayout>

  return (
    <div className="min-h-screen bg-gradient-to-r mt-20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="bg-primary text-primary-foreground p-6 rounded-t-xl">
            <div className="flex items-center justify-center space-x-4">
              <GavelIcon className="w-12 h-12" />
              <div>
                <CardTitle className="text-3xl font-extrabold">{session.user.name ? session.user.name : "User" + "'s"} Lawyer Registration</CardTitle>
                <CardDescription className="text-xl">Join our legal network today</CardDescription>
              </div>
              <Image
                  src={session.user.image || "/ProfilePicPlaceholder.png"}
                  height={100}
                  width={100}
                  alt='profile pic'
                  className='rounded-full'
                />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <LawyerRegistrationForm session={session} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

