import prisma from '@/lib/db'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Mail, Building2, Calendar, Scale, ExternalLink, Phone } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from "@/components/ui/badge"
import { institutions, lawFields, localities } from '@/types/lawyer'
import { ConsultDialogue } from './_components/ConsultDialogue'

type Props = {
    params: {
        id: string
    }
}

const LawyerProfilePage = async ({ params }: Props) => {
    const { id } = await params;
    const lawyer = await prisma.lawyer.findFirst({
        where: {
            id: id
        },
        include: {
            user: true
        }
    })

    if (!lawyer) {
        notFound()
    }

    const degrees = lawyer.degrees.map((degree) => {
        const matchingField = lawFields.find((lawField) => lawField.value === degree);
        return matchingField ? matchingField.label : degree;
    });

    return (
        <div className="pt-20 min-h-screen">
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
                    <Image
                        src={lawyer.user.image || "/ProfilePicPlaceholder.png"}
                        alt={`${lawyer.firstName} ${lawyer.lastName}`}
                        width={200}
                        height={200}
                        className="rounded-full border-4 border-white shadow-lg"
                        priority
                    />
                    <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4 flex-grow">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                {lawyer.firstName} {lawyer.lastName}
                            </h1>
                            <p className="text-xl text-gray-600 mt-1">Advocate</p>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                            <MapPin className="w-5 h-5 mr-2" />
                            <span>{ localities.map((locality) => {
                                if(locality.value === lawyer.locality){
                                    return locality.label
                                }
                            })}, {lawyer.locationCountry}</span>
                        </div>

                        <div className="space-y-1 text-gray-700">
                            <p className="font-medium">{degrees.join(', ')}</p>
                            <p>{ institutions.map((institution) => {
                                if(institution.value === lawyer.institution){
                                    return institution.label
                                }
                            })}</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="text-sm">
                                <Calendar className="w-4 h-4 mr-1" />
                                Practicing since {new Date(lawyer.createdAt).getFullYear()}
                            </Badge>
                            <Badge variant="secondary" className="text-sm">
                                <Scale className="w-4 h-4 mr-1" />
                                {lawyer.numCasesPerformed} cases performed
                            </Badge>
                        </div>

                        <ConsultDialogue lawyer={lawyer} />
                    </div>
                </div>

                <Tabs defaultValue="details" className="w-full">
                    <TabsList className="w-full flex justify-center mb-8">
                        <TabsTrigger 
                            value="about"
                            className="px-8 py-2 text-lg font-medium text-gray-600 hover:text-gray-800 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 transition-all"
                        >
                            About
                        </TabsTrigger>
                        <TabsTrigger 
                            value="details"
                            className="px-8 py-2 text-lg font-medium text-gray-600 hover:text-gray-800 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 transition-all"
                        >
                            Details
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="about">
                        <Card className="bg-white shadow-md">
                            <CardContent className="p-6">
                                <p className="text-gray-700 leading-relaxed">{lawyer.about}</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="details">
                        <Card className="bg-white shadow-md">
                            <CardContent className="space-y-6 p-6">
                                <div className="flex items-start gap-4">
                                    <Mail className="w-6 h-6 text-blue-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Email address</p>
                                        <a href={`mailto:${lawyer.publicEmail}`} className="text-gray-700 hover:text-blue-600 transition-colors">
                                            {lawyer.publicEmail}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Phone className="w-6 h-6 text-blue-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Phone Number</p>
                                        <a href={`tel:${lawyer.phoneNumber}`} className="text-gray-700 hover:text-blue-600 transition-colors">
                                            {lawyer.phoneNumber}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Building2 className="w-6 h-6 text-blue-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Office address</p>
                                        <p className="text-gray-700">{lawyer.locality},</p>
                                        <p className="text-gray-700">{lawyer.locationState}, {lawyer.locationCountry}</p>
                                    </div>
                                </div>

                                {lawyer.publicWebsiteUrl && (
                                    <div className="flex items-start gap-4">
                                        <ExternalLink className="w-6 h-6 text-blue-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Website</p>
                                            <a href={`${lawyer.publicWebsiteUrl}`} className="text-blue-600 hover:underline">
                                                {lawyer.publicWebsiteUrl}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default LawyerProfilePage

