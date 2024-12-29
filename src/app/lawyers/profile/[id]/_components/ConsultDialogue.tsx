"use client"

import * as React from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Lawyer } from "@prisma/client"
import { LawIcon } from "@primer/octicons-react"
import { Mail, Phone } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"


export function ConsultDialogue({ lawyer }: { lawyer: Lawyer }) {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button>Consult {lawyer.firstName}</Button>
            </DrawerTrigger>
            <DrawerContent className="p-10">
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle className="text-3xl">Consult <span className="text-emerald-800 hover:underline font-semibold">{lawyer.firstName}</span> <LawIcon className="h-10 w-10 text-emerald-800" /> </DrawerTitle>
                        <DrawerDescription>Book a Consultation Now</DrawerDescription>
                    </DrawerHeader>
                    <div className="space-y-3 ml-5">
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
                                <p className="text-gray-700 hover:text-blue-600 transition-colors">
                                    {lawyer.phoneNumber}
                                </p>
                            </div>
                        </div>
                    </div>
                    <DrawerFooter>
                        <Link
                            className={cn(buttonVariants({ variant: "default" }))}
                            href={`/chat/${lawyer.id}`}
                        >
                            Talk to <span className="text-emerald-500 font-bold">{lawyer.firstName}</span>
                        </Link>
                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
