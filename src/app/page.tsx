"use server"
import { auth } from '@/auth'
import HomeClient from '@/components/Global/ClientDashboardPage'
import React from 'react'

const page = async () => {
	const session = await auth();
	return (
		<HomeClient session={session} />
	)
}

export default page