'use client'

import React, { useState } from 'react'
import { FaGoogle } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { signInProvider } from '@/actions/Auth/login'

type Provider = 'google' | 'github' | 'twitter' | 'linkedin'

type ProviderInfo = {
  name: Provider
  icon: React.ReactNode
  color: string
  hoverColor: string
  textColor: string
}

const providers: ProviderInfo[] = [
  { name: 'google', icon: <FaGoogle size={20} />, color: 'bg-white', hoverColor: 'hover:bg-gray-100', textColor: 'text-gray-700' },
]

export default function ProviderSignIn() {
  const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null)
  const { toast } = useToast()

  const handleProviderSignIn = async (provider: Provider) => {
    setLoadingProvider(provider)

    try {
      const data = await signInProvider(provider)
      if (data?.error) {
        throw new Error(data.error)
      }
      toast({
        title: 'Success',
        description: `Signed in with ${provider} successfully!`,
        duration: 3000,
      })
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err instanceof Error ? err.message : 'An unexpected error occurred',
        duration: 5000,
      })
    } finally {
      setLoadingProvider(null)
    }
  }

  return (
    <div className="mt-6 space-y-4">
      {providers.map(({ name, icon, color, hoverColor, textColor }) => (
        <motion.div
          key={name}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            disabled={loadingProvider !== null}
            variant="outline"
            className={`relative h-12 w-full ${color} ${hoverColor} ${textColor} transition-all duration-300 shadow-md hover:shadow-lg`}
            onClick={() => handleProviderSignIn(name)}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {loadingProvider === name ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <div className="flex items-center justify-center w-full">
                  {icon}
                  <span className="ml-3 font-semibold capitalize">
                    Sign in with {name}
                  </span>
                </div>
              )}
            </div>
          </Button>
        </motion.div>
      ))}
    </div>
  )
}

