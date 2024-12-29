import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LockIcon } from 'lucide-react'
import Link from 'next/link'

export default function AuthMessage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-50">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="bg-red-100 text-red-800 p-6 rounded-t-xl">
          <div className="flex items-center justify-center space-x-4">
            <LockIcon className="w-12 h-12" />
            <CardTitle className="text-2xl font-bold">Authentication Required</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <CardDescription className="text-center text-lg mb-6">
            Please sign in to access the lawyer registration form.
          </CardDescription>
          <Button asChild className="w-full">
            <Link href="/api/auth/signin">Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

