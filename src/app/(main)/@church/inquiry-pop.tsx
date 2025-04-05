'use client'
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export function InquiryPop({ children, cafeId, cafeName }: { children: React.ReactNode, cafeId: string, cafeName: string }) {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState('')
  const router = useRouter()
  const writeInquiry = async () => {
    const supabase = await createClient()
    const { data: user } = await supabase.auth.getUser()
    const { error } = await supabase.from('inquiry')
      .insert({
        content,
        church_id: user.user?.id,
        cafe_id: cafeId,
        user_id: user.user?.id,
      })
    if (error) toast('생성에 실패하였습니다.', {
      description: error.message,
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    })
    else {
      toast('신청 완료했습니다.',)
      setOpen(false)
    }
    router.refresh()
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="cursor-pointer">
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4 mb-2">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{cafeName} 문의 남기기</h4>
          </div>
          <div className="grid gap-2">
            <div className="flex flex-col items-left gap-4">
              <Textarea
                id="inquiry"
                defaultValue={content}
                onChange={e => setContent(e.target.value)}
                className="col-span-2 h-8"
              />
            </div>
          </div>
        </div>
        <Button onClick={() => writeInquiry()}>제출</Button>
      </PopoverContent>
    </Popover>
  )
}
