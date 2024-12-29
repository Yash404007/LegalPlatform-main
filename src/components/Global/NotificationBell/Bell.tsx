'use client'

import { useState } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { markAllAsRead, markAsRead } from '@/actions/notifications'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Prisma } from '@prisma/client'

export type NotificationType = Prisma.NotificationsGetPayload<{
    include: {
      user: {
        include: {
          lawyer: true
        }
      }
    }
}>

interface NotificationBellProps {
  userId: string
  initialNotifications: NotificationType[]
}

export function NotificationBell({ userId, initialNotifications }: NotificationBellProps) {
  const [notifications, setNotifications] = useState(initialNotifications)

  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkAllAsRead = async () => {
    await markAllAsRead(userId)
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId)
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0 mr-4">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="text-xs">
                  Mark all as read
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[300px] px-3">
              {notifications.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <Link key={notification.id} href={`/chat/${notification.sentLawyerId || "/"}`}>
                    <DropdownMenuItem  className="mb-2 last:mb-0 p-0 focus:bg-transparent">
                      <div className={`w-full p-3 rounded-lg transition-colors ${notification.read ? 'bg-background' : 'bg-muted'}`}>
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm ${notification.read ? 'text-muted-foreground' : 'font-medium'}`}>
                            {notification.message}
                          </p>
                          {!notification.read && (
                            <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notification.id)} className="h-auto py-1 px-2 text-xs">
                              Mark as read
                            </Button>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground mt-1 block">
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  </Link>
                ))
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

