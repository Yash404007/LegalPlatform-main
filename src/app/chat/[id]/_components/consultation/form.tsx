'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ConsultationFormData, consultationSchema } from "@/lib/schema/ConsultationSchema"
import { submitConsultation } from "@/actions/consultation"

interface ConsultationFormProps {
  lawyerId: string
}

export function ConsultationForm({ lawyerId }: ConsultationFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
  })

  const onSubmit = async (data: ConsultationFormData) => {
    setIsLoading(true)
    const formData = new FormData()
    formData.append("description", data.description)
    formData.append("date", data.date.toISOString())
    formData.append("lawyerId", lawyerId)
    
    const result = await submitConsultation(formData)
    
    if (result.success) {
      toast.success("Consultation request submitted successfully")
    } else {
      toast.error(typeof result.error === 'string' ? result.error : "Failed to submit consultation request")
    }
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Textarea
          {...register("description")}
          placeholder="Describe your legal issue"
          className="min-h-[100px]"
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>
      <div>
        <Input
          {...register("date", { valueAsDate: true })}
          type="datetime-local"
        />
        {errors.date && (
          <p className="text-sm text-red-500">{errors.date.message}</p>
        )}
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit Consultation Request"}
      </Button>
    </form>
  )
}

