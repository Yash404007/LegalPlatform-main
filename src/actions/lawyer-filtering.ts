/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function fetchLawyers(filters: {
  name?: string
  gender?: string
  locality?: string
  degree?: string
  institution?: string
  sortBy?: 'name' | 'cases'
}) {
  const { name, gender, locality, degree, institution, sortBy } = filters

  const query: any = {
    include: {
      user: true
    },
    where: {},
    orderBy: sortBy === 'cases' 
      ? [{ numCasesPerformed: 'desc' }] 
      : [{ firstName: 'asc' }, { lastName: 'asc' }],
  }

  if (name) {
    query.where.OR = [
      { firstName: { contains: name, mode: 'insensitive' } },
      { lastName: { contains: name, mode: 'insensitive' } }
    ]
  }

  if (gender) query.where.gender = gender
  if (locality) query.where.locality = locality
  if (institution) query.where.institution = institution
  if (degree) query.where.degrees = { has: degree }

  const lawyers = await prisma.lawyer.findMany(query)

  return lawyers
}

