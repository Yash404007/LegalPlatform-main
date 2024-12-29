'use client'

import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogOut, ChevronDown, User, Mail } from 'lucide-react'
import { Session } from 'next-auth'
import { useRouter } from 'next/navigation'

export default function CoolUserButton({ session }: { session: Session }) {
  const { user } = session
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter();

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-20 md:w-40 rounded-full pl-2 pr-1 bg-white">
          <motion.div
            className="flex items-center justify-between w-full"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={user.image ?? '/ProfilePicPlaceholder.png'} alt={user.name ?? ''} />
              <AvatarFallback>{user.name?.[0]}</AvatarFallback>
            </Avatar>
            <span className="hidden md:block flex-grow text-left text-sm font-medium truncate">{user.name || user.email} </span>
            <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
          </motion.div>
        </Button>
      </DropdownMenuTrigger>
      <AnimatePresence>
        {open && (
          <DropdownMenuContent
            className="w-64"
            align="end"
            forceMount
            asChild
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DropdownMenuItem className="p-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.image ?? '/ProfilePicPlaceholder.png'} alt={user.name ?? ''} />
                    <AvatarFallback>{user.name?.[0] || user.email}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.name || user.email?.split("@")[0]}</span>
                    <span className="text-xs text-muted-foreground truncate flex-grow text-left font-medium ">{(user.email ?? '').length > 10 ? user?.email?.slice(0, 18) + "..." : user.email}</span>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push(`/profile?ref=${"nav"}`)} className="p-2 cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-2 cursor-pointer">
                <Mail className="mr-2 h-4 w-4" />
                <span>Inbox</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="p-2 cursor-pointer text-red-500 focus:text-red-500 dark:text-red-400 dark:focus:text-red-400"
                onSelect={(event) => {
                  event.preventDefault()
                  signOut()
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </motion.div>
          </DropdownMenuContent>
        )}
      </AnimatePresence>
    </DropdownMenu>
  )
}