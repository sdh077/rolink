import { login } from './actions'
import { Form } from 'react-hook-form'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { SigninForm } from './signin-form'
import Image from 'next/image'

export default function LoginPage() {
  const loginAction = async (formData: FormData) => {
    const { success } = await login(formData)
    if (success) {
      revalidatePath('/', 'layout')
      redirect('/')
    } else {
      console.log(success)
    }
  }
  return (
    <div className='w-screen h-screen bg-primary-300 overflow-hidden'>
      <div className='flex p-12'>
        <div className='relative flex-5/6'>
          <Image src={'/login-bg.png'} alt='login bg' fill objectFit={'cover'} />
        </div>
        <SigninForm />
      </div>
    </div>
  )
  return (
    <Form action={loginAction} className='flex justify-center items-center w-full h-screen bg-slate-200'>
      <div className="w-[500px] h-[500px] border rounded-2xl py-8 px-12 bg-white flex items-center justify-center">
        <div className='w-full'>
          <div className='text-center text-3xl font-medium pb-16'>커피링크</div>
          <div className="relative">
            <input
              id="ID"
              name="ID"
              type="ID"
              required
              placeholder=" "
              className="shadow-sm peer w-full rounded-md border border-gray-200 px-3 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-hidden"
            />
            <label
              htmlFor="id"
              className="absolute top-3.5 left-3 px-1 text-sm rounded-md text-gray-400 transition-all peer-not-placeholder-shown:-top-1.5 peer-not-placeholder-shown:z-50 peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:text-xs peer-focus:-top-1.5 peer-focus:bg-white peer-focus:text-xs peer-focus:text-primary-500"
            >
              아이디
            </label>
          </div>
          {/* <div>
          <label className="text-xl" htmlFor="email">이메일</label>
          <input id="email" name="email" type="email" required />
        </div> */}
          <div className="relative my-5">
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder=" "
              className="shadow-sm peer w-full rounded-md border border-gray-200 px-3 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-hidden"
            />
            <label
              htmlFor="password"
              className="absolute top-3.5 left-3 px-1 text-sm text-gray-400 transition-all peer-not-placeholder-shown:-top-1.5 peer-not-placeholder-shown:z-50 peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:text-xs peer-focus:-top-1.5 peer-focus:bg-white peer-focus:text-xs peer-focus:text-primary-500"
            >
              비밀번호
            </label>
          </div>
          <div>
            {/* <Button
              type="submit"
              className="shadow-sm bg-primary-500 hover:bg-primary-600 mt-5 w-full cursor-pointer rounded-md py-2.5 text-white transition-all hover:text-white"
              formAction={login}>로그인</Button> */}
          </div>
        </div>
      </div>
    </Form>
  )
}