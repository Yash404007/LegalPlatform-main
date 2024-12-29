"use client"

import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

type Props = {
    children: React.ReactNode,
    content: React.ReactNode,
    side?: "top" | "bottom" | "left" | "right"
    classname?: string
}

const TooltipWrapper = ({ children, content, side = "top", classname }: Props) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-block">{children}</span>
        </TooltipTrigger>
        <TooltipContent className={cn(classname)} side={side}>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default TooltipWrapper