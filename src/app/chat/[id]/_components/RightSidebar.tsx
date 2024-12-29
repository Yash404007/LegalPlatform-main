"use client"

import { LawyerType } from '@/components/Global/LawyerCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Briefcase } from 'lucide-react'
import React from 'react'

type Props = {
    featuredLawyers: LawyerType[]
}

const RightSidebar = ({ featuredLawyers }: Props) => {
    return (
        <aside className="w-80 border-l max-h-screen overflow-scroll bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 p-4">
                    {featuredLawyers.map((lawyer) => (
                        <Card key={lawyer.id} className="overflow-hidden transition-shadow hover:shadow-md">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={lawyer.user.image || "/ProfilePicPlaceholder.png"} alt={`${lawyer.firstName} ${lawyer.lastName}`} />
                                        <AvatarFallback>{lawyer.firstName[0]}{lawyer.lastName[0]}</AvatarFallback>
                                    </Avatar>
                                </div>
                                <CardTitle className="text-base mt-2">
                                    {lawyer.firstName} {lawyer.lastName}
                                </CardTitle>
                                
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                    <div className="flex items-center">
                                        <Briefcase className="w-4 h-4 mr-1 text-primary" />
                                        <span>{lawyer.numCasesPerformed} cases</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </aside>
    )
}

export default RightSidebar

