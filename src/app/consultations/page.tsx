import { getConsultations } from '@/actions/consultation';
import { auth } from '@/auth'
import prisma from '@/lib/db';
import React from 'react'
import {redirect} from "next/navigation"
import { ConsultationCard } from './_components/card';

const page = async () => {
    const session = await auth();
    const lawyer = await prisma.lawyer.findFirst({
        where: {
            userId: session?.user.id
        }
    })

    if(!lawyer) redirect("/getting-started");

    const consultations = await getConsultations(lawyer?.id);
    return (
        <div className='flex items-center justify-center p-20'>
            {consultations.map((consultation) => {
                return <ConsultationCard 
                            key={consultation.id}
                            consultation={consultation} 
                        />
            })}
        </div>
    )
}

export default page