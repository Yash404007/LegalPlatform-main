"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Scroll } from 'lucide-react'

interface CompactDegreeListProps {
  degrees: string[]
  initialDisplay?: number
}

export default function DegreeList({ degrees, initialDisplay = 2 }: CompactDegreeListProps) {
  const [showAll, setShowAll] = useState(false)

  const truncatedDegrees = showAll ? degrees : degrees.slice(0, initialDisplay)
  const hasMore = degrees.length > initialDisplay

  return (
    <div className="text-sm">
      <div className="flex items-center space-x-2 pb-2">
        <Scroll className="w-4 h-4 text-primary" />
        <span className="text-sm">Degrees</span>
      </div>
      <ul className="space-y-1 pl-2">
        {truncatedDegrees.map((degree, index) => (
          <li key={index} className="flex items-start">
            <span className="flex-shrink-0 w-4 h-4 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center mr-2">
              {index + 1}
            </span>
            <span className="flex-1 line-clamp-1">{degree}</span>
          </li>
        ))}
      </ul>
      {hasMore && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-1 h-6 px-0 w-full justify-start text-xs font-normal"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? (
            <>
              <ChevronUp className="w-3 h-3 mr-1" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3 mr-1" />
              Show {degrees.length - initialDisplay} more
            </>
          )}
        </Button>
      )}
    </div>
  )
}

