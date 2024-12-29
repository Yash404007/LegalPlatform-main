'use client'

import type { Session } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { buttonVariants } from '../ui/button'
import { cn } from '@/lib/utils'

export default function HomeClient({ session } : {session : Session | null}) {
	const [titleText, setTitleText] = useState("Expert Legal Solutions")
	const [isTransitioning, setIsTransitioning] = useState(false)

	useEffect(() => {
		const interval = setInterval(() => {
			setIsTransitioning(true)
			setTimeout(() => {
				setTitleText(prev =>
					prev === "Expert Legal Solutions"
						? "Business Legal Solutions"
						: "Expert Legal Solutions"
				)
				setIsTransitioning(false)
			}, 500)
		}, 5000)

		return () => clearInterval(interval)
	}, [])

	return (
		<div className="min-h-screen bg-slate-900">
			

			<main className="relative min-h-screen">
				<Image
					src="/cover.jpg"
					alt="Lady Justice statue"
					fill
					className="object-cover"
					priority
				/>
				<div className="absolute inset-0 bg-slate-900/75" />

				<div className="relative container mx-auto px-4 flex min-h-screen flex-col items-center justify-center text-center">
					<h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 transition-opacity duration-1000 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
						{titleText}
					</h1>
					<p className="text-xl sm:text-2xl text-slate-300 mb-10 max-w-2xl">
						Get professional legal advice from our network of experienced lawyers
					</p>
                    <div className="space-x-4">
                        <Link 
                            href={"/getting-started"}
                            className={cn(buttonVariants({size: "lg"}), "text-white bg-blue-500 hover:bg-blue-600")}
                        >
                            Get Started
                        </Link>
                        <Link 
                            href={ session ? "/learn-more" : "/login"}
                            className={cn(buttonVariants({size: "lg", variant: "outline"}))}
                        >
                            { session ? "Learn More" : "Login"}
                        </Link>
                    </div>
				</div>
			</main>
		</div>
	)
}

