import { NextResponse } from "next/server"
import prisma  from "@/lib/db"
import { auth } from "@/auth"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || !session.user.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { id } = params
  const { status, date } = await request.json()

  try {
    const updatedConsultation = await prisma.consultation.update({
      where: { id },
      data: { status, date },
    })
    return NextResponse.json(updatedConsultation)
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update consultation" }, { status: 500 })
  }
}

