import { Lawyer } from "@prisma/client"

export type SortOption = "name" | "age" | "cases"

export function filterLawyers(lawyers: Lawyer[], filters: {
  search?: string
  gender?: string
  locality?: string
  degree?: string
  institution?: string
  tags?: string[]
}) {
  return lawyers.filter(lawyer => {
    if (filters.search && !`${lawyer.firstName} ${lawyer.lastName}`.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }
    if (filters.gender && lawyer.gender !== filters.gender) {
      return false
    }
    if (filters.locality && lawyer.locality !== filters.locality) {
      return false
    }
    if (filters.degree && !lawyer.degrees.includes(filters.degree)) {
      return false
    }
    if (filters.institution && lawyer.institution !== filters.institution) {
      return false
    }
    if (filters.tags && filters.tags.length > 0 && !filters.tags.every(tag => lawyer.tags.includes(tag))) {
      return false
    }
    return true
  })
}

export function sortLawyers(lawyers: Lawyer[], sortBy: SortOption, sortOrder: "asc" | "desc") {
  return [...lawyers].sort((a, b) => {
    let comparison = 0
    switch (sortBy) {
      case "name":
        comparison = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
        break
      case "age":
        comparison = a.dateOfBirth.getTime() - b.dateOfBirth.getTime()
        break
      case "cases":
        comparison = parseInt(a.numCasesPerformed) - parseInt(b.numCasesPerformed)
        break
    }
    return sortOrder === "asc" ? comparison : -comparison
  })
}

