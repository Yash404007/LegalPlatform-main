import { Prisma } from '@prisma/client'
import { z } from 'zod'

export const filterSchema = z.object({
  search: z.string().optional(),
  locality: z.string().optional(),
  gender: z.string().optional(),
  tags: z.array(z.string()).optional(),
  areasOfPractice: z.array(z.string()).optional(),
  minCases: z.number().optional(),
  maxCases: z.number().optional(),
  sortBy: z.enum(['numberOfCases', 'startingPracticeFrom']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})

export type FilterParams = z.infer<typeof filterSchema>

export function buildLawyerQuery(params: FilterParams): Prisma.LawyerWhereInput {
  const query: Prisma.LawyerWhereInput = {}

  if (params.search) {
    query.OR = [
      { firstName: { contains: params.search, mode: 'insensitive' } },
      { lastName: { contains: params.search, mode: 'insensitive' } },
      { qualifications: { contains: params.search, mode: 'insensitive' } },
      { institutionOfWork: { contains: params.search, mode: 'insensitive' } },
      { writeAboutYourself: { contains: params.search, mode: 'insensitive' } },
    ]
  }

  if (params.locality) {
    query.locality = params.locality
  }

  if (params.gender) {
    query.gender = params.gender
  }

  if (params.tags && params.tags.length > 0) {
    query.tags = {
      hasSome: params.tags,
    }
  }

  if (params.areasOfPractice && params.areasOfPractice.length > 0) {
    query.areasOfPractice = {
      hasSome: params.areasOfPractice,
    }
  }

  if (params.minCases !== undefined) {
    query.numberOfCases = {
      ...query.numberOfCases,
      gte: params.minCases,
    }
  }

  if (params.maxCases !== undefined) {
    query.numberOfCases = {
      ...query.numberOfCases,
      lte: params.maxCases,
    }
  }

  return query
}

export function buildLawyerOrderBy(params: FilterParams): Prisma.LawyerOrderByWithRelationInput {
  if (params.sortBy === 'numberOfCases') {
    return { numberOfCases: params.sortOrder || 'desc' }
  } else if (params.sortBy === 'startingPracticeFrom') {
    return { startingPracticeFrom: params.sortOrder || 'desc' }
  }
  return { createdAt: 'desc' }
}
