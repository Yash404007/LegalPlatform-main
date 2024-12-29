'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Consultation, ConsultationStatus, User } from '@prisma/client'
import { GetUserById } from '@/actions/Data/User/GET'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  DatetimePicker
} from "@/components/ui/datetime-picket"
import { useMutation } from '@tanstack/react-query'
import { updateConsultation } from '@/actions/consultation'
import { LawyerDatetimeEditSchema } from '@/lib/schema/ConsultationSchema'

interface ConsultationCardProps {
  consultation: Consultation;
}

export function ConsultationCard({ consultation }: ConsultationCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const getStatusColor = (status: ConsultationStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500 text-yellow-950'
      case 'ACCEPTED':
        return 'bg-green-500 text-green-950'
      case 'REJECTED':
        return 'bg-red-500 text-red-950'
      case 'COMPLETED':
        return 'bg-blue-500 text-blue-950'
      default:
        return 'bg-gray-500 text-gray-950'
    }
  }

  const form = useForm<z.infer<typeof LawyerDatetimeEditSchema>>({
    resolver: zodResolver(LawyerDatetimeEditSchema),
    defaultValues: {
      "dateTime": new Date()
    },
  })

  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    async function fetchUser() {
      const user = await GetUserById(consultation.userId);
      setUser(user);
    }
    fetchUser();
  }, [consultation.userId])

  const { mutate } = useMutation({
    mutationKey: ["EditConsultation"],
    mutationFn: (values: z.infer<typeof LawyerDatetimeEditSchema>) => 
      updateConsultation(consultation.id, values),
    onSuccess: () => {
      toast.success("Successfully Edited Consultation", { id: "edit-consultation" });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to edit consultation: ${error.message}`, {id: "edit-consultation"})
    }
  })

  function onSubmit(values: z.infer<typeof LawyerDatetimeEditSchema>) {
    mutate(values);
  }

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Consultation #{consultation.id.slice(0, 8)}</span>
          <Badge className={getStatusColor(consultation.status)}>
            {consultation.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-2">
          Created: {format(new Date(consultation.createdAt), 'PPP')}
        </p>
        <p className="text-sm text-gray-500 mb-2">
          Client: {user?.email}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          {consultation.DateTime ? `Scheduled: ${format(new Date(consultation.DateTime), 'PPP p')}` : 'Not scheduled'}
        </p>
        <p className="line-clamp-3">{consultation.description}</p>
      </CardContent>
      <CardFooter>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={consultation.status === "ACCEPTED" || consultation.status === "COMPLETED"} variant="outline" className="w-full">Edit Consultation</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Consultation</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
                <FormField
                  control={form.control}
                  name="dateTime"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Submission Date</FormLabel>
                      <DatetimePicker
                        {...field}
                        format={[
                          ["months", "days", "years"],
                          ["hours", "minutes", "am/pm"],
                        ]}
                      />
                      <FormDescription>Add the date of submission in detail.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}

