/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import {
    toast
} from "sonner"
import { LawyerType } from '@/components/Global/LawyerCard'
import { Button } from '@/components/ui/button'
import { User } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import React from 'react'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { submitConsultation } from '@/actions/consultation'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Textarea
} from "@/components/ui/textarea"
import {
    useForm
} from "react-hook-form"
import {
    zodResolver
} from "@hookform/resolvers/zod"
import * as z from "zod"
import { consultationSchema } from "@/lib/schema/ConsultationSchema"
import { ArrowRight, Loader2 } from "lucide-react"


type propTypes = {
    lawyer: LawyerType,
    client: User,
    disabled: boolean
}

const ConsultButton = ({ lawyer, disabled }: propTypes) => {
    const { mutate, isPending } = useMutation({
        mutationKey: ["BookConsltation"],
        mutationFn: submitConsultation,
        onSuccess: (result) => {
            toast.success("Successfully Booked Consultation", { id: "create-workflow" });
        },
        onError: (error) => {
            toast.error(`Failed to book consultation ${error.message}`, {id: "create-workflow"})
        }

    })
    const form = useForm<z.infer<typeof consultationSchema>>({
        resolver: zodResolver(consultationSchema),
        defaultValues: {
            lawyerId: lawyer.id
        }
    })

    function onSubmit(values: z.infer<typeof consultationSchema>) {
        try {
            toast.loading("Booking...", { id: "create-workflow" });
            mutate(values);
        } catch (error) {
            console.error("Form submission error", error);
            toast.error("Failed to submit the form. Please try again.");
        }
    }

    return (
        <Drawer>
            <DrawerTrigger disabled={disabled} className='font-semibold p-3 rounded-none text-white w-screen hover:bg-emerald-900 bg-emerald-600'>
                Consult <span className="underline antialiased text-white">{lawyer.firstName + " " + lawyer.lastName}</span>
            </DrawerTrigger>
            <DrawerContent className="p-20">
                <DrawerHeader className="w-full flex items-center justify-center flex-col">
                    <DrawerTitle className="text-2xl">Book a Consultation</DrawerTitle>
                    <DrawerDescription>This action cannot be undone.</DrawerDescription>
                </DrawerHeader>
                <div className="w-full">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Consultation Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder=""
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>Make it precise and concise.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button disabled={isPending} type='submit' className='w-full'>
                                <div className="flex items-center justify-center">
                                    {isPending ? <Loader2 className="animate-spin" /> : "Proceed"}
                                    {!isPending && <ArrowRight size={6} />}
                                </div>
                            </Button>
                        </form>
                    </Form>
                </div>
            </DrawerContent>
        </Drawer>

    )
}

export default ConsultButton