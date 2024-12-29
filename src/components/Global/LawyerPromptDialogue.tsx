/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { localities, lawFields, institutions, genders } from '@/types/lawyer'
import { fetchLawyers } from '@/actions/lawyer-filtering'
import LawyerCard from './LawyerCard'

type SortOption = 'name' | 'cases'

export function LawyerFilterSort({ initialLawyers }: { initialLawyers: any[] }) {
  const [lawyers, setLawyers] = useState(initialLawyers)
  const [nameFilter, setNameFilter] = useState('')
  const [genderFilter, setGenderFilter] = useState('')
  const [localityFilter, setLocalityFilter] = useState('')
  const [degreeFilter, setDegreeFilter] = useState('')
  const [institutionFilter, setInstitutionFilter] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('name')
  const router = useRouter()

  const handleFilter = async () => {
    const filteredLawyers = await fetchLawyers({
      name: nameFilter,
      gender: genderFilter,
      locality: localityFilter,
      degree: degreeFilter,
      institution: institutionFilter,
      sortBy: sortOption
    })
    setLawyers(filteredLawyers)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Filter Lawyers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                {genders.map(gender => (
                  <SelectItem key={gender.value} value={gender.value}>{gender.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="locality">Locality</Label>
            <Select value={localityFilter} onValueChange={setLocalityFilter}>
              <SelectTrigger id="locality">
                <SelectValue placeholder="Select locality" />
              </SelectTrigger>
              <SelectContent>
                {localities.map(locality => (
                  <SelectItem key={locality.value} value={locality.value}>{locality.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="degree">Degree</Label>
            <Select value={degreeFilter} onValueChange={setDegreeFilter}>
              <SelectTrigger id="degree">
                <SelectValue placeholder="Select degree" />
              </SelectTrigger>
              <SelectContent>
                {lawFields.map(field => (
                  <SelectItem key={field.value} value={field.value}>{field.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="institution">Institution</Label>
            <Select value={institutionFilter} onValueChange={setInstitutionFilter}>
              <SelectTrigger id="institution">
                <SelectValue placeholder="Select institution" />
              </SelectTrigger>
              <SelectContent>
                {institutions.map(institution => (
                  <SelectItem key={institution.value} value={institution.value}>{institution.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="sort">Sort By</Label>
            <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
              <SelectTrigger id="sort">
                <SelectValue placeholder="Select sort option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="cases">Number of Cases</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleFilter}>Apply Filters</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Filtered Lawyers</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-3">
              {lawyers.map(lawyer => (
                <LawyerCard lawyer={lawyer} key={lawyer.id} />
              ))}
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
