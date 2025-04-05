"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary-500 relative h-8 w-full overflow-hidden rounded-sm",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-primary-900 h-full w-full flex-1 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
      {/* 텍스트 추가 */}
      <span className="absolute inset-0 flex items-center justify-center text-white font-bold z-10">
        {value}%
      </span>
    </ProgressPrimitive.Root>
  )
}

export { Progress }
