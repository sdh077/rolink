import { IInquiryCustom } from "@/interface/inquiry"
import { createClient } from "@/utils/supabase/server"
import InquiryAnswer from "./inquiry-answer"

const getInquiry = async (id: string) => {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  return await supabase.from('inquiry')
    .select('*, cafe:user!cafe_id(*), church:user!church_id(*), user:user!user_id(*)')
    .eq('church_id', user.user?.id)
    .eq('id', id)
    .single<IInquiryCustom>()
}
const getInquirySub = async (id: string) => {
  const supabase = await createClient()
  return await supabase.from('inquiry')
    .select('*, cafe:user!cafe_id(*), church:user!church_id(*), user:user!user_id(*)')
    .eq('parent', id)
    .overrideTypes<IInquiryCustom[]>()
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { data: inquiry } = await getInquiry(id)
  const { data: subs } = await getInquirySub(id)
  if (!inquiry) return <div>잘 못 된 접근입니다</div>

  return (
    <div className="container">
      <div className="w-full p-16 border rounded-lg">
        <div>글쓴이: {inquiry.user.name}</div>
        <div>대상: {inquiry.cafe.name}</div>
        <div>내용: {inquiry.content}</div>
      </div>

      <div>
        답변
        <div>
          {subs?.map(sub =>
            <div key={sub.id} className="border rounded-lg">
              <div>글쓴이: {sub.user.name}</div>
              <div>대상: {sub.cafe.name}</div>
              <div>내용: {sub.content}</div>
            </div>
          )}
        </div>
      </div>
      <InquiryAnswer inquiry={inquiry!} />
    </div>
  )
}