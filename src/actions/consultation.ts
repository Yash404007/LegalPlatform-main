'use server'

import { consultationSchema, ConsultationFormData, LawyerDatetimeEditSchema } from "@/lib/schema/ConsultationSchema" 
import  prisma  from "@/lib/db"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function submitConsultation(data: ConsultationFormData) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return { error: "Not authenticated" }
  }

  const validatedFields = consultationSchema.safeParse(data)

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors }
  }

  const { description } = validatedFields.data

  try {
    const consultation = await prisma.consultation.create({
      data: {
        description,
        userId: session.user.id,
        lawyerId: validatedFields.data.lawyerId,
        status: "PENDING",
      },
    })
    revalidatePath('/consultations')

    return { success: true, consultation }
  } catch (error) {
    console.error(error)
    return { error: "Failed to submit consultation request" }
  }
}

export async function getConsultations(lawyerId: string) {
  const session = await auth();
  if (!session || !session.user.id) {
    throw new Error("Unauthenticated");
  }

  try {
    const consultations = await prisma.consultation.findMany({
      where: { lawyerId },
      orderBy: { createdAt: "desc" },
    })
    return consultations
  } catch(error)  {
    console.error({error})
    throw new Error("Something Went Wrong");
  }
}

import { z } from "zod";

type editschems = z.infer<typeof LawyerDatetimeEditSchema>

export async function updateConsultation(id: string, values : editschems) {
  const session = await auth();
  if (!session || !session.user.id) {
    throw new Error("Unauthenticated");
  }

  const validatedFields = LawyerDatetimeEditSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors }
  }

  try {
    const updatedConsultation = await prisma.consultation.update({
      where: { id },
      data: {status: "ACCEPTED" , DateTime: validatedFields.data.dateTime},
    })
    revalidatePath('/consultations')
    return { success: true, consultation: updatedConsultation }
  } catch (error) {
    console.error(error);
    return { error: "Failed to update consultation" }
  }
}
