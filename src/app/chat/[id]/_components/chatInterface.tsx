'use client'

import React, { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import {Paperclip, Send } from 'lucide-react'
import { sendMessage } from '@/actions/messages'
import { User } from '@prisma/client'
import { MessageFormValues, messageSchema } from '@/lib/schema/MessagingSchema'
import { LawyerType } from '@/components/Global/LawyerCard'
import RightSidebar from './RightSidebar'
import SuccessToast from '@/components/Global/SuccessToast'

type Message = {
    id: string;
    content: string;
    senderId: string;
    createdAt: Date;
}

type Props = {
    currentUser: User;
    otherUser: User;
    initialMessages: Message[];
    bothAreLawyers: boolean;
    featuredLawyers: LawyerType[];
    lawyer: LawyerType
}

const ChatInterface = ({ currentUser, otherUser, initialMessages, bothAreLawyers, featuredLawyers, lawyer }: Props) => {
    const queryClient = useQueryClient()

    const form = useForm<MessageFormValues>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: "",
        },
    })

    const { data: messages = initialMessages } = useQuery({
        queryKey: ['messages', currentUser.id, otherUser.id],
        queryFn: async () => {
            const response = await fetch(`/api/messages?senderId=${currentUser.id}&receiverId=${otherUser.id}`)
            if (!response.ok) {
                throw new Error('Failed to fetch messages')
            }
            return response.json()
        },
        initialData: initialMessages,
    })

    const mutation = useMutation({
        mutationFn: async (values: MessageFormValues) => {
            return await sendMessage({
                content: values.content,
                receiverId: otherUser.id,
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages', currentUser.id, otherUser.id] })
            toast.success('Message sent successfully')
            form.reset()
        },
        onError: () => {
            toast.error('Failed to send message')
        },
    })

    const onSubmit = (values: MessageFormValues) => {
        mutation.mutate(values)
    }

    useEffect(() => {
        if(bothAreLawyers){
            <SuccessToast message='Note: Both Parties in this Converstaion are Lawyers' />
        }
    }, [])

    return (
        <div className="flex h-[87vh] bg-background" suppressHydrationWarning>
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="border-b p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            {otherUser.userName?.[0] || "U"}
                        </div>
                        <div>
                            <h2 className="font-semibold">{lawyer.firstName + " " + lawyer.lastName || "User"}</h2>
                            <p className="text-sm text-muted-foreground">Local time: {new Date().toLocaleTimeString()}</p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message: Message) => (
                        <div key={message.id} className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 rounded-lg max-w-[70%] ${message.senderId === currentUser.id
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                }`}>
                                {message.content}
                                <div className="text-xs mt-1 opacity-70">
                                    {new Date(message.createdAt).toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Message Input */}
                <div className="border-t p-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
                            <Button type="button" variant="ghost" size="icon">
                                <Paperclip className="h-4 w-4" />
                            </Button>
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Input
                                                className="rounded-full"
                                                placeholder="Type your message..."
                                                {...field}
                                                disabled={mutation.isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={mutation.isPending}
                                className="rounded-full"
                            >
                                {mutation.isPending ? (
                                    <span className="loading loading-spinner"></span>
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>

            {/* Right Sidebar */}
            <RightSidebar featuredLawyers={featuredLawyers} />
        </div>
    )
}

export default ChatInterface

