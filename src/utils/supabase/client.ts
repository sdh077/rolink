import { createBrowserClient } from "@supabase/ssr";

export const createClient = (schema: string = 'rolink') =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: {
        schema
      }
    }
  );
