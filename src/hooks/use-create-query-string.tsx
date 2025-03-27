'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export const useCreateQueryString = () => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const createQueryString = useCallback(
    (name: string, value: string) => {
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  return createQueryString;
};
export const useRouterPush = () => {
  const router = useRouter()
  const pathname = usePathname()
  const createQuery = useCreateQueryString()
  const searchParams = useSearchParams();

  const pushPathname = useCallback(
    (name: string, value: string) => {
      const q = createQuery(name, value)
      router.push(`${pathname}?${q}`)
    },
    [searchParams]
  );

  return pushPathname;
}