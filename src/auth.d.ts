import { DefaultSession } from 'next-auth';

// user 객체에 id와 acceessToken 프로퍼티 타입을 추가함
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user?: {
      id?: string;
      shopId: string
    } & DefaultSession['user'];
    accessToken: string;
  }
}
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    daum: any;
  }
}