"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { LuLoader } from "react-icons/lu"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { LoginSchema, LoginSchemaType } from "@/lib/schema/LoginSchema"
import { ErrorMessage } from "@/components/Global/ErrorMessage"
import SuccessToast from "@/components/Global/SuccessToast"
import { Login } from "@/actions/Auth/login"

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")

  const {
    handleSubmit,
    formState: { errors },
    register,
    reset
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
  })

  const handleLogin = async (data: LoginSchemaType) => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await Login(data)
      if (response && response.success_status) {
        setSuccess(response.success)
      } else if (response && !response.success_status) {
        setError(response.error)
      } else {
        setError("An unexpected error occurred")
      }
    } finally {
      setIsLoading(false)
      if (!error) {
        reset()
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit(handleLogin)} className="w-full max-w-md">
        <Card className="w-full shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                disabled={isLoading}
                {...register("email", { required: "Email is required" })}
                id="email"
                placeholder="abc@example.com"
                className="font-mono"
              />
              {errors.email && <ErrorMessage message={errors.email.message} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                disabled={isLoading}
                {...register("password", { required: "Password is required" })}
                id="password"
                type="password"
                placeholder="••••••••••••"
              />
              {errors.password && <ErrorMessage message={errors.password.message} />}
            </div>
            {error && <ErrorMessage message={error} />}
            {success && <SuccessToast message={success} />}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <LuLoader className="animate-spin mr-2" /> : "Login"}
            </Button>
            <div className="text-center space-y-2">
              <Link href="/password/reset/form" className="text-sm text-primary hover:underline">
                Forgot your password?
              </Link>
              <p className="text-sm">
                Lost? <Link className="text-primary hover:underline" href="/">Go back home</Link>
              </p>
            </div>
            {errors.root && <ErrorMessage message={errors.root.message} />}
          </CardFooter>
        </Card>
        <Card className="mt-4 p-4 text-center shadow-md">
          <Link href="/register" className="text-primary hover:underline">
            {"Don't"} have an account? Sign up
          </Link>
        </Card>
      </form>
    </div>
  )
}

