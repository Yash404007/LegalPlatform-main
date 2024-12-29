"use client"

import { useState } from "react"
import { Lawyer } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { filterLawyers, sortLawyers, SortOption } from "@/lib/lawyerFilter"
import { genders, localities, lawFields, institutions } from "@/types/lawyer"

interface LawyerFilterSortProps {
  lawyers: Lawyer[]
}

export function LawyerFilterSort({ lawyers }: LawyerFilterSortProps) {
  const [filteredLawyers, setFilteredLawyers] = useState(lawyers)
  const [filters, setFilters] = useState({
    search: "",
    gender: "",
    locality: "",
    degree: "",
    institution: "",
    tags: [] as string[]
  })
  const [sortBy, setSortBy] = useState<SortOption>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    let result = filterLawyers(lawyers, filters)
    result = sortLawyers(result, sortBy, sortOrder)
    setFilteredLawyers(result)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Filter and Sort Lawyers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search by name"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select onValueChange={(value) => handleFilterChange("gender", value)}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {genders.map((gender) => (
                    <SelectItem key={gender.value} value={gender.value}>
                      {gender.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="locality">Locality</Label>
              <Select onValueChange={(value) => handleFilterChange("locality", value)}>
                <SelectTrigger id="locality">
                  <SelectValue placeholder="Select locality" />
                </SelectTrigger>
                <SelectContent>
                  {localities.map((locality) => (
                    <SelectItem key={locality.value} value={locality.value}>
                      {locality.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="degree">Degree</Label>
              <Select onValueChange={(value) => handleFilterChange("degree", value)}>
                <SelectTrigger id="degree">
                  <SelectValue placeholder="Select degree" />
                </SelectTrigger>
                <SelectContent>
                  {lawFields.map((field) => (
                    <SelectItem key={field.value} value={field.value}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="institution">Institution</Label>
              <Select onValueChange={(value) => handleFilterChange("institution", value)}>
                <SelectTrigger id="institution">
                  <SelectValue placeholder="Select institution" />
                </SelectTrigger>
                <SelectContent>
                  {institutions.map((institution) => (
                    <SelectItem key={institution.value} value={institution.value}>
                      {institution.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sortBy">Sort By</Label>
              <Select onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger id="sortBy">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="age">Age</SelectItem>
                  <SelectItem value="cases">Number of Cases</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-between">
            <Button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
              {sortOrder === "asc" ? "Ascending" : "Descending"}
            </Button>
            <Button onClick={applyFilters}>Apply Filters</Button>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLawyers.map((lawyer) => (
          <Card key={lawyer.id}>
            <CardHeader>
              <CardTitle>{`${lawyer.firstName} ${lawyer.lastName}`}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Gender: {lawyer.gender}</p>
              <p>Locality: {lawyer.locality}</p>
              <p>Degrees: {lawyer.degrees.join(", ")}</p>
              <p>Institution: {lawyer.institution}</p>
              <p>Cases Performed: {lawyer.numCasesPerformed}</p>
              <p>Tags: {lawyer.tags.join(", ")}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

