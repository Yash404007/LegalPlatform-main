import React from 'react'
import BackButton from './BackButton'
import { NavMenu } from './NavMenu'
import Link from 'next/link'
import UserButton from '../Auth/Userbutton/Button'
import { auth } from '@/auth'
import prisma from '@/lib/db'
import { buttonVariants } from '../ui/button'
import { cn } from '@/lib/utils'
import { Badge } from '../ui/badge'
import { NotificationBellWrapper } from './NotificationBell/Wrapper'

const NavBar = async () => {
    const session = await auth();
    const lawyer = await prisma.lawyer.findMany({
        where: {
            userId: session?.user.id
        }
    })
    const registerLawyerButton = (
        <>
            {lawyer.length === 0 && (
                <Link
                    href="/lawyers/registration"
                    className={cn(
                        buttonVariants({ variant: "default" }),
                        "relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-bold text-white rounded-lg group",
                        "bg-gradient-to-br from-purple-600 to-blue-500",
                        "hover:from-purple-500 hover:to-blue-400",
                        "transition-all duration-300 ease-out",
                        "transform hover:scale-105",
                        "shadow-lg hover:shadow-xl",
                    )}
                >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></span>
                    <span className="relative">Register as a Lawyer</span>
                </Link>
            )}
        </>
    )
    return (
        <header className="fixed top-0 w-full z-50 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/80">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center space-x-8">
                    <BackButton />
                    <Link href="/" className="text-2xl font-bold text-white">
                        LegalHub
                    </Link>
                    <NavMenu />
                </div>
                <div className="">
                    {registerLawyerButton}
                </div>
                <div className="flex items-center justify-center space-x-4">
                    {session ? <UserButton session={session} /> : <div className="flex items-center space-x-4">
                        <Link
                            href={"/login"}
                            className="px-4 py-2 text-sm font-medium text-slate-200 hover:text-white transition-colors"
                        >
                            Log In
                        </Link>
                        <Link
                            href={"/register"}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded transition-colors"
                        >
                            Sign Up
                        </Link>
                    </div>}

                    {lawyer.length !== 0 && <Badge variant={"default"}>Lawyer</Badge>}

                    <NotificationBellWrapper />

                    <Link href={"/consultations"} className={cn(buttonVariants({variant: "default"}))} >Consultations</Link>
                </div>
            </div>
        </header>
    )
}

export default NavBar