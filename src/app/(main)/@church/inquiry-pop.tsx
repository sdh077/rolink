'use client'
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export function InquiryPop({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">문의 남기기</h4>
          </div>
          <div className="grid gap-2">
            <div className="flex flex-col items-left gap-4">
              <Textarea
                id="inquiry"
                defaultValue="100%"
                className="col-span-2 h-8"
              />
            </div>
          </div>
        </div>
        <Button>제출</Button>
      </PopoverContent>
    </Popover>
  )
}
