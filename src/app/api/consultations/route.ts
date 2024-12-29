import { NextResponse } from "next/server"
import  prisma  from "@/lib/db"
import { auth } from "@/auth"

export async function GET(request: Request) {
  const session = await auth();
  if (!session || !session.user.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const lawyerId = searchParams.get("lawyerId")

  if (!lawyerId) {
    return NextResponse.json({ error: "Lawyer ID is required" }, { status: 400 })
  }

  try {
    const consultations = await prisma.consultation.findMany({
      where: { lawyerId },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(consultations)
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch consultations" }, { status: 500 })
  }
}

