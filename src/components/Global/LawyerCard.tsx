import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Briefcase, MapPin, User2Icon } from 'lucide-react'
import { Prisma } from '@prisma/client'
import { lawFields } from '@/types/lawyer'
import DegreeList from './DegreeList'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { buttonVariants } from '../ui/button'

export type LawyerType = Prisma.LawyerGetPayload<{
    include: { user: true }
}>

interface LawyerCardProps {
    lawyer: LawyerType
}

export default function LawyerCard({ lawyer }: LawyerCardProps) {
    const fullName = `${lawyer.firstName} ${lawyer.lastName}`
    const initials = `${lawyer.firstName[0]}${lawyer.lastName[0]}`
    const location = lawyer.locationState
        ? `${lawyer.locality}, ${lawyer.locationState}, ${lawyer.locationCountry}`
        : `${lawyer.locality}, ${lawyer.locationCountry}`

    const degrees = lawyer.degrees.map((degree) => {
        const matchingField = lawFields.find((lawField) => lawField.value === degree);
        return matchingField ? matchingField.label : degree;
    });

    return (
        <Card className="w-96 mt-4 bg-gradient-to-br from-slate-50 to-slate-100 shadow-lg">
            <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                    <Avatar className="w-20 h-20 border-2 border-primary">
                        <AvatarImage src={lawyer.user.image || `https://api.dicebear.com/6.x/initials/svg?seed=${fullName}`} />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-2xl font-bold">{fullName}</h2>
                        <p className="text-sm text-muted-foreground">{lawyer.institution}</p>
                    </div>
                    <div className="">
                        <Link href={`/lawyers/profile/${lawyer.id}`} className={cn(buttonVariants({variant: "default"}))}>Visit</Link>
                    </div>
                </div>

                <div className="mt-4 space-y-2">
                    {/* <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-primary" />
                        <span className="text-sm">{lawyer.phoneNumber}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-primary" />
                        <span className="text-sm">{lawyer.email}</span>
                    </div> */}
                    <div className="flex items-center space-x-2">
                        <User2Icon className="w-4 h-4 text-primary" />
                        <span className="text-sm">{lawyer.user.userName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-sm">{location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Briefcase className="w-4 h-4 text-primary" />
                        <span className="text-sm">{lawyer.numCasesPerformed} cases performed</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <DegreeList degrees={degrees} initialDisplay={1} />
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    {lawyer.tags.map((tag, index) => (
                        <Badge key={index} className='rounded-full' variant="default">{tag}</Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
