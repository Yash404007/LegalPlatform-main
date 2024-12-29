"use server";

import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function getLawyers(searchParams?: {
  search?: string;
  locality?: string;
  gender?: string;
  practiceArea?: string;
  tag?: string;
}) {
  try {
    const where: Prisma.LawyerWhereInput = {};

    if (searchParams?.search) {
      where.OR = [
        { firstName: { contains: searchParams.search, mode: "insensitive" } },
        { lastName: { contains: searchParams.search, mode: "insensitive" } },
        { qualifications: { contains: searchParams.search, mode: "insensitive" } },
        { institutionOfWork: { contains: searchParams.search, mode: "insensitive" } },
      ];
    }

    if (searchParams?.locality) {
      where.locality = searchParams.locality;
    }

    if (searchParams?.gender) {
      where.gender = searchParams.gender;
    }

    if (searchParams?.practiceArea) {
      where.areasOfPractice = {
        contains: searchParams.practiceArea,
        mode: "insensitive",
      };
    }

    if (searchParams?.tag) {
      where.tags = {
        contains: searchParams.tag,
        mode: "insensitive",
      };
    }

    const lawyers = await prisma.lawyer.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    return lawyers;
  } catch (error) {
    console.error("Failed to fetch lawyers:", error);
    throw new Error("Failed to fetch lawyers");
  }
}