'use client'

import { useState } from "react"
import { toast } from "sonner"
import { format } from "date-fns"
import { Drawer } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getConsultations, updateConsultation } from "@/actions/consultation"
import { Consultation } from "@prisma/client"

enum ConsultationStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    COMPLETED = "COMPLETED"
  }

interface ConsultationDrawerProps {
  lawyerId: string
}

export function ConsultationDrawer({ lawyerId }: ConsultationDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const queryClient = useQueryClient()

  const { data: consultationsData, isLoading } = useQuery({
    queryKey: ["consultations", lawyerId],
    queryFn: () => getConsultations(lawyerId),
  })

  const updateConsultationMutation = useMutation({
    mutationFn: ({ id, status, date }: { id: string; status: ConsultationStatus; date?: Date }) =>
      updateConsultation(id, status, date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultations", lawyerId] })
      toast.success("Consultation updated successfully")
    },
    onError: () => {
      toast.error("Failed to update consultation")
    },
  })

  const handleAccept = (id: string) => {
    updateConsultationMutation.mutate({ id, status: ConsultationStatus.ACCEPTED, date: selectedDate })
  }

  const handleReject = (id: string) => {
    updateConsultationMutation.mutate({ id, status: ConsultationStatus.REJECTED })
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Manage Consultations</Button>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <div className="p-4 space-y-4">
          <h2 className="text-2xl font-bold">Consultation Requests</h2>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
          {isLoading ? (
            <p>Loading consultations...</p>
          ) : consultationsData?.success ? (
            <ul className="space-y-4">
              {consultationsData.consultations.map((consultation: Consultation) => (
                <li key={consultation.id} className="border p-4 rounded-md">
                  <p><strong>Date:</strong> {format(new Date(consultation.date), "PPP")}</p>
                  <p><strong>Description:</strong> {consultation.description}</p>
                  <p><strong>Status:</strong> {consultation.status}</p>
                  {consultation.status === "PENDING" && (
                    <div className="mt-2 space-x-2">
                      <Button onClick={() => handleAccept(consultation.id)} disabled={!selectedDate}>
                        Accept
                      </Button>
                      <Button onClick={() => handleReject(consultation.id)} variant="destructive">
                        Reject
                      </Button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>Failed to load consultations</p>
          )}
        </div>
      </Drawer>
    </>
  )
}

