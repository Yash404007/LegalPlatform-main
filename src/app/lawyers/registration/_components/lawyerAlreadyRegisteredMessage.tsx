import { redirect } from "next/navigation"

export default function LawyerAlreadyRegisteredLayout({
    children,
}: {
    children: React.ReactNode
}) {
    redirect("/getting-started")
    return children
}

