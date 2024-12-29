import { z } from "zod"

export const consultationSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters long"),
  lawyerId: z.string()
})

export const LawyerDatetimeEditSchema = z.object({
  dateTime: z.coerce.date()
});

export type ConsultationFormData = z.infer<typeof consultationSchema>
